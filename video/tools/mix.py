"""Mixage final : voix + musique + sound design → deux masters prêts à publier.

  output/audio/mix_vo.wav      voix off + musique (baissée automatiquement sous la voix) + sound design
  output/audio/mix_music.wav   version sans voix off : musique + sound design
Normalisation : -14 LUFS intégrés, crête vraie ≤ -1 dBTP (recommandation TikTok / Reels / Shorts).
Usage : python3 tools/mix.py
"""
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = Path(__file__).resolve().parent.parent
STORY = json.loads((ROOT / "config" / "story.json").read_text())
TIMINGS = json.loads((ROOT / "assets" / "audio" / "vo" / "timings.json").read_text())
SR = 48000
DUR = STORY["video"]["duration"]
N = int(SR * DUR)
OUT = ROOT / "output" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

TARGET_LUFS, TARGET_TP = -14.0, -1.0
MUSIC_DUCK_DB, SFX_DUCK_DB = -10.0, -4.0


def load(p):
    x, sr = sf.read(p, dtype="float64", always_2d=True)
    assert sr == SR, f"{p}: {sr} Hz"
    x = x.T
    if x.shape[0] == 1:
        x = np.vstack([x, x])
    out = np.zeros((2, N))
    out[:, : min(N, x.shape[1])] = x[:, :N]
    return out


music = load(ROOT / "assets" / "audio" / "music" / "music.wav")
sfx = load(ROOT / "assets" / "audio" / "sfx" / "sfx.wav")

# --- Voix : placement, nettoyage léger, très légère ambiance
vo = np.zeros(N)
act = np.zeros(N)
for tm in TIMINGS:
    x, _ = sf.read(ROOT / "assets" / "audio" / "vo" / f"{tm['id']}.wav", dtype="float64")
    i0 = int(tm["start"] * SR)
    x = x[: N - i0]
    vo[i0:i0 + len(x)] += x
    act[i0:i0 + len(x)] = 1
vo = sosfilt(butter(2, 85, "high", fs=SR, output="sos"), vo)
# compression douce (gain lissé sur l'enveloppe)
env = np.sqrt(fftconvolve(vo ** 2, np.ones(int(0.03 * SR)) / int(0.03 * SR), mode="same").clip(1e-12))
thr = 0.12
gain = np.where(env > thr, (thr / env) ** (1 - 1 / 2.5), 1.0)
vo = vo * gain
rng = np.random.default_rng(3)
n_ir = int(0.5 * SR)
ir = rng.standard_normal(n_ir) * np.exp(-np.arange(n_ir) / SR * 14)
ir /= np.sqrt((ir ** 2).sum())
vo = vo + 0.05 * fftconvolve(vo, ir)[:N]
vo_st = np.vstack([vo, vo])

# --- Ducking : enveloppe d'activité vocale lissée (attaque 120 ms, relâche 450 ms)
def smooth(a, att, rel):
    out = np.zeros_like(a)
    ka, kr = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    # implémentation par blocs (rapide) : on lisse à 1 kHz puis on interpole
    step = SR // 1000
    small = a[::step]
    o = np.zeros_like(small)
    v = 0.0
    ka, kr = np.exp(-1 / (att * 1000)), np.exp(-1 / (rel * 1000))
    for i, s in enumerate(small):
        v = (ka if s > v else kr) * v + (1 - (ka if s > v else kr)) * s
        o[i] = v
    return np.interp(np.arange(len(a)), np.arange(len(small)) * step, o)

# anticipe légèrement la voix (le ducking commence 150 ms avant)
lead = int(0.15 * SR)
act_lead = np.concatenate([act[lead:], np.zeros(lead)])
d = smooth(np.maximum(act, act_lead), 0.12, 0.45)
g_music = 10 ** (MUSIC_DUCK_DB * d / 20)
g_sfx = 10 ** (SFX_DUCK_DB * d / 20)

mix_vo = vo_st * 1.0 + music * g_music * 0.8 + sfx * g_sfx * 0.85
mix_mu = music * 1.0 + sfx * 0.85


def master(x, name):
    raw = OUT / f"_{name}_raw.wav"
    x = x / max(1e-9, np.max(np.abs(x))) * 0.7
    sf.write(raw, x.T.astype(np.float32), SR)
    # Passe 1 : mesure
    p1 = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(raw), "-af",
                         f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:print_format=json", "-f", "null", "-"],
                        capture_output=True, text=True).stderr
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p1, re.S).group(0))
    # Passe 2 : normalisation linéaire
    dst = OUT / f"{name}.wav"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw), "-af",
                    f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
                    f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
                    "-ar", str(SR), "-c:a", "pcm_s24le", str(dst)], check=True)
    raw.unlink()
    chk = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(dst), "-af", "ebur128=peak=true", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", chk)[-1]
    TP = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", chk)[-1]
    print(f"{dst.relative_to(ROOT)}  {I} LUFS intégrés, crête vraie {TP} dBTP")


master(mix_vo, "mix_vo")
master(mix_mu, "mix_music")
