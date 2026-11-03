"""Musique originale + sound design de la vidéo NEJ Digital (aucun sample, aucun droit tiers).

Tout est synthétisé ici, de façon reproductible (graine fixe), et calé sur :
  - les scènes de config/story.json (structure musicale, 96 BPM, 1 mesure = 2,5 s) ;
  - les repères de config/cues.json (impacts, transitions, clics…).

Sorties :
  assets/audio/music/music.wav   piste musicale (stéréo 48 kHz)
  assets/audio/sfx/sfx.wav       sound design (stéréo 48 kHz)

Arc émotionnel :
  S1 hook        nappe sombre, un seul « ping » : le carré bleu
  S2 débuts      piano en arpèges, intime (Ré mineur : Dm–Bb–F–C)
  S3 chemin      tension : pulsation grave, ostinato « horloge », accords plus sombres, montée
  S4 construction  les éléments s'empilent : kick, cordes, percussions inspirées du djembé
  S5 vision      sommet : tout l'ensemble, mélodie, toms sur les affirmations
  S6 conclusion  respiration, puis résolution lumineuse en Fa majeur sur le logo
Usage : python3 tools/music.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = Path(__file__).resolve().parent.parent
STORY = json.loads((ROOT / "config" / "story.json").read_text())
CUES = json.loads((ROOT / "config" / "cues.json").read_text())["cues"]
SR = 48000
DUR = STORY["video"]["duration"]
N = int(SR * DUR)
BPM = STORY["video"]["bpm"]
BEAT = 60 / BPM
BAR = 4 * BEAT
rs = np.random.default_rng(2026)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def buf():
    return np.zeros((2, N))


def add(dst, sig, t0, gain=1.0, pan=0.0):
    i0 = int(round(t0 * SR))
    if i0 >= N:
        return
    if i0 < 0:
        sig = sig[-i0:]
        i0 = 0
    sig = sig[: N - i0]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    dst[0, i0:i0 + len(sig)] += sig * gain * l * 1.4142
    dst[1, i0:i0 + len(sig)] += sig * gain * r * 1.4142


def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR * 0.45), "low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bp(x, f1, f2, order=2):
    return sosfilt(butter(order, [f1, min(f2, SR * 0.45)], "band", fs=SR, output="sos"), x)


def env_adsr(n, a, d, s, r, sustain_len):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sl = max(0, int(sustain_len * SR) - a - d)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sl, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def reverb_ir(seconds=2.6, bright=5000, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.stack([r.standard_normal(n), r.standard_normal(n)]) * np.exp(-t * 6.9 / seconds)
    ir = np.stack([lp(ir[0], bright), lp(ir[1], bright)])
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))


def reverb(x, ir, wet):
    out = x.copy() * (1 - wet * 0.35)
    for c in range(2):
        out[c] += fftconvolve(x[c], ir[c])[: x.shape[1]] * wet
    return out


# ---------------------------------------------------------------- instruments
def piano(f, dur, vel=0.5, bright=1.0):
    n = int((dur + 1.6) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    B = 0.00025
    base_tau = 2.6 - min(f, 1200) / 1200 * 1.4
    for k in range(1, 11):
        fk = k * f * np.sqrt(1 + B * k * k)
        if fk > SR * 0.45:
            break
        amp = (1 / k ** 1.15) * (0.75 if k == 2 else 1) * (bright if k > 3 else 1)
        tau = base_tau / (1 + 0.45 * (k - 1))
        out += amp * np.sin(2 * np.pi * fk * t + rs.uniform(0, 6.28)) * np.exp(-t / tau)
    out *= np.minimum(1, t / 0.004)
    rel = int(dur * SR)
    if rel < n:
        out[rel:] *= np.exp(-np.arange(n - rel) / SR / 0.22)
    ham = lp(rs.standard_normal(int(0.02 * SR)), 3000) * np.exp(-np.arange(int(0.02 * SR)) / SR / 0.004) * 0.15
    out[: len(ham)] += ham
    return out * vel * 0.25


def saw(f, n, detune_cents=0.0):
    ph = (np.arange(n) * f * 2 ** (detune_cents / 1200) / SR + rs.uniform()) % 1.0
    return 2 * ph - 1


def pad(notes, dur, fc=1400, attack=1.2, release=1.6, vol=0.06, vib=0.0):
    n = int((dur + release) * SR)
    out = np.zeros(n)
    t = np.arange(n) / SR
    for m in notes:
        f = hz(m)
        for dc in (-7, 0, 6):
            fm = f * (1 + vib * 0.004 * np.sin(2 * np.pi * 5.2 * t + rs.uniform(0, 6)))
            ph = np.cumsum(fm * 2 ** (dc / 1200) / SR) + rs.uniform()
            out += 2 * (ph % 1.0) - 1
    out = lp(out, fc, 2)
    e = env_adsr(n, attack, 0.5, 0.85, release, dur)
    return out * e * vol / len(notes)


def bass(f, dur, vol=0.22):
    n = int((dur + 0.3) * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    x = np.tanh(1.4 * x)
    return x * env_adsr(n, 0.01, 0.2, 0.75, 0.25, dur) * vol


def kick(vol=0.8, tight=1.0):
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 32 * tight)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7 * tight)
    click = hp(rs.standard_normal(int(0.004 * SR)), 2500) * 0.25
    x[: len(click)] += click
    return np.tanh(1.5 * x) * vol


def tom(f0=95, vol=0.6, decay=4.0):
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    f = f0 * (0.7 + 0.3 * np.exp(-t * 14))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * decay)
    x += lp(rs.standard_normal(n), 900) * np.exp(-t * 18) * 0.35
    return np.tanh(1.3 * x) * vol


def djembe(kind, vol=0.35):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    if kind == "bass":
        x = np.sin(2 * np.pi * (70 + 40 * np.exp(-t * 40)) * t) * np.exp(-t * 14)
    elif kind == "tone":
        x = (np.sin(2 * np.pi * 330 * t) + 0.5 * np.sin(2 * np.pi * 520 * t)) * np.exp(-t * 26)
        x += bp(rs.standard_normal(n), 800, 2500) * np.exp(-t * 60) * 0.4
    else:  # slap
        x = bp(rs.standard_normal(n), 1800, 5000) * np.exp(-t * 55) * 1.2
        x += np.sin(2 * np.pi * 420 * t) * np.exp(-t * 40) * 0.4
    return x * vol


def shaker(vol=0.05):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return hp(rs.standard_normal(n), 6500) * np.minimum(1, t / 0.012) * np.exp(-t * 45) * vol


# ---------------------------------------------------------------- harmonie
CH = {  # basse (midi), voix (midi)
    "Dm": (38, [57, 62, 65, 69, 64]), "Bb": (34, [58, 62, 65, 70, 60]), "F": (41, [57, 60, 65, 69, 67]),
    "C": (36, [55, 60, 64, 67, 62]), "Gm": (43, [58, 62, 67, 70]), "A": (45, [57, 61, 64, 69]),
    "Csus": (36, [55, 60, 65, 67]), "Fadd9": (41, [57, 60, 65, 67, 72]),
}
# (début en mesures, nom, durée en mesures)
PLAN = [
    (0, "Dm", 2), (2, "Bb", 1),
    (3, "Dm", 1), (4, "Bb", 1), (5, "F", 1), (6, "C", 1), (7, "Dm", 1),
    (8, "Bb", 1), (9, "Gm", 1), (10, "Dm", 1), (11, "A", 1), (12, "Bb", 1), (13, "Gm", 1), (14, "A", 1),
    (15, "Dm", 1), (16, "Bb", 1), (17, "F", 1), (18, "C", 1), (19, "Dm", 1), (20, "Bb", 1), (21, "Csus", 1),
    (22, "Bb", 1), (23, "C", 1), (24, "Dm", 1), (25, "F", 1), (26, "Bb", 1), (27, "C", 1), (28, "Dm", 1), (29, "Csus", 1),
    (30, "Dm", 1), (31, "Bb", 1), (32, "Gm", 1), (33, "Csus", 0.4), (33.4, "Fadd9", 2.6),
]


def section(bar):
    t = bar * BAR
    for s in STORY["scenes"]:
        if s["start"] <= t + 1e-6 < s["end"]:
            return s["id"]
    return STORY["scenes"][-1]["id"]


music = buf()
pads = buf()
rng_pat = np.random.default_rng(7)

for bar0, name, nbars in PLAN:
    t0, dur = bar0 * BAR, nbars * BAR
    root, voices = CH[name]
    sec = section(bar0)
    # --- nappe
    fc = {"s1-hook": 700, "s2-debuts": 1100, "s3-difficultes": 900, "s4-construction": 1800, "s5-vision": 2600, "s6-conclusion": 1500}[sec]
    vol = {"s1-hook": 0.05, "s2-debuts": 0.05, "s3-difficultes": 0.055, "s4-construction": 0.072, "s5-vision": 0.075, "s6-conclusion": 0.055}[sec]
    p = pad([v - 12 for v in voices[:3]] + voices[:2], dur, fc=fc, attack=1.0 if sec != "s1-hook" else 2.5, vol=vol)
    add(pads, p, t0, pan=-0.25)
    add(pads, pad(voices[1:4], dur, fc=fc * 1.2, attack=1.2, vol=vol * 0.6), t0, pan=0.3)
    # --- cordes (S4/S5) : nappe brillante avec vibrato
    if sec in ("s4-construction", "s5-vision") or (sec == "s6-conclusion" and bar0 >= 33.4):
        sv = 0.05 if sec == "s4-construction" else 0.055
        add(pads, pad([v + 12 for v in voices[:3]], dur, fc=4200, attack=1.6, vol=sv, vib=1.0), t0, pan=0.0)
    # --- basse
    if sec in ("s3-difficultes", "s4-construction", "s5-vision") or bar0 >= 33.4 or sec == "s1-hook":
        if sec == "s5-vision":
            for k in range(int(nbars * 8)):
                add(music, bass(hz(root + (12 if k % 2 else 0)), BEAT / 2 * 0.9, 0.16), t0 + k * BEAT / 2)
        elif sec == "s1-hook":
            add(music, bass(hz(root), dur, 0.10), t0)
        else:
            add(music, bass(hz(root), dur * 0.98, 0.17), t0)
    # --- piano
    arp = voices + [voices[1] + 12, voices[2] + 12]
    if sec == "s2-debuts":
        for k in range(int(nbars * 8)):
            if k % 8 in (3, 7) and rng_pat.random() < 0.5:
                continue
            m = arp[[0, 2, 1, 3, 2, 4, 1, 3][k % 8]] + 12 if k % 8 < 8 else 0
            add(music, piano(hz(m), BEAT * 0.9, vel=0.38 + 0.08 * (k % 4 == 0)), t0 + k * BEAT / 2, pan=0.15 * np.sin(k))
    elif sec == "s3-difficultes":
        for k in range(int(nbars * 4)):
            add(music, piano(hz(voices[0]), BEAT * 1.6, vel=0.22, bright=0.6), t0 + k * BEAT, pan=-0.2)
    elif sec in ("s4-construction", "s5-vision"):
        dens = 8 if sec == "s4-construction" else 8
        for k in range(int(nbars * dens)):
            m = arp[[0, 2, 4, 3, 1, 5, 2, 6][k % 8] % len(arp)] + 12
            add(music, piano(hz(m), BEAT * 0.8, vel=0.42 if sec == "s4-construction" else 0.40), t0 + k * BEAT / 2, pan=0.25 * np.sin(k * 1.3))
        if sec == "s5-vision":  # mélodie
            mel = [voices[3] + 12, voices[2] + 12, voices[1] + 12 + 2, voices[2] + 12]
            for k, m in enumerate(mel):
                add(music, piano(hz(m), BEAT * 1.8, vel=0.5, bright=1.2), t0 + k * BEAT, pan=0.05)
    elif sec == "s6-conclusion":
        if bar0 < 33:
            for k in range(int(nbars * 4)):
                add(music, piano(hz(arp[[0, 2, 1, 3][k % 4]] + 12), BEAT * 1.5, vel=0.3), t0 + k * BEAT, pan=0.1)
        else:
            for k, m in enumerate(voices + [voices[2] + 12]):
                add(music, piano(hz(m + 12), 3.5, vel=0.36), t0 + 0.06 * k, pan=-0.3 + 0.12 * k)
    elif sec == "s1-hook" and bar0 == 2:
        for k, m in enumerate([62, 65, 69]):
            add(music, piano(hz(m + 12), 2.5, vel=0.25), t0 + 0.12 + 0.09 * k)

# --- rythmique
drums = buf()
sc = {s["id"]: s for s in STORY["scenes"]}
s3, s4, s5, s6 = sc["s3-difficultes"], sc["s4-construction"], sc["s5-vision"], sc["s6-conclusion"]
# S3 : pulsation grave (cœur) + ostinato « horloge » qui s'intensifie
t = s3["start"]
while t < s3["end"] - 0.3:
    add(drums, kick(0.42, tight=0.6), t)
    add(drums, kick(0.25, tight=0.6), t + BEAT * 0.75)
    t += BEAT * 2
k = 0
t = s3["start"] + BAR * 2
while t < s3["end"] - 0.2:
    inten = (t - s3["start"]) / (s3["end"] - s3["start"])
    n = int(0.05 * SR)
    tick = lp(hp(rs.standard_normal(n), 2500), 6500) * np.exp(-np.arange(n) / SR * 140)
    add(drums, tick, t, gain=(0.012 + 0.022 * inten) * (1.5 if k % 4 == 0 else 0.8), pan=0.4 if k % 2 else -0.4)
    t += BEAT / 4
    k += 1
# S4 : kick sur 1 et 3, shaker, djembé
t = s4["start"] + BAR * 2
while t < s4["end"] - 0.6:
    add(drums, kick(0.62), t)
    add(drums, kick(0.5), t + BEAT * 2)
    t += BAR
t = s4["start"] + BAR * 4
while t < s4["end"] - 0.6:
    for j in range(8):
        add(drums, shaker(0.05 if j % 2 else 0.035), t + j * BEAT / 2, pan=0.35)
    t += BAR
DJ = [(0, "bass"), (0.75, "tone"), (1.5, "slap"), (2, "tone"), (2.5, "tone"), (3.25, "slap"), (3.5, "slap")]
t = s4["start"] + BAR * 4
while t < s4["end"] - 0.6:
    for b, kind in DJ:
        add(drums, djembe(kind, 0.22), t + b * BEAT, pan=-0.35)
    t += BAR
# S5 : ensemble complet
t = s5["start"]
while t < s5["end"] - 0.5:
    for b in (0, 1.5, 2, 3.5) if t >= s5["start"] + BAR * 4 else (0, 2):
        add(drums, kick(0.62), t + b * BEAT)
    for j in range(8):
        add(drums, shaker(0.06 if j % 2 else 0.04), t + j * BEAT / 2, pan=0.35)
    for b, kind in DJ:
        add(drums, djembe(kind, 0.3), t + b * BEAT, pan=-0.35)
    t += BAR
# S6 : pulsation douce pendant la mosaïque
t = 78.75
while t < 83.0:
    add(drums, kick(0.32, tight=0.7), t)
    t += BEAT * 2

IR = reverb_ir(2.8, 4500, 1)
music = reverb(music, IR, 0.32)
pads = reverb(pads, IR, 0.45)
drums = reverb(drums, reverb_ir(1.2, 6000, 2), 0.12)
mus = music + pads + drums

# Fondu d'entrée/sortie + « trou » avant l'impact de la construction (respiration)
t_axis = np.arange(N) / SR
g = np.ones(N)
g *= np.clip(t_axis / 0.4, 0, 1)
gap0, gap1 = s4["start"] - 0.22, s4["start"]
g[(t_axis > gap0) & (t_axis < gap1)] *= 0.15
g *= np.clip((DUR - t_axis) / 2.5, 0, 1) ** 1.5
mus *= g

# ---------------------------------------------------------------- sound design
fx = buf()


def noise(n):
    return rs.standard_normal(n)


def sweep_noise(dur, f_from, f_to, bands=10):
    n = int(dur * SR)
    out = np.zeros(n)
    x = noise(n)
    tt = np.linspace(0, 1, n)
    fs_ = np.geomspace(f_from, f_to, bands)
    for i, f in enumerate(fs_):
        centre = i / (bands - 1)
        w = np.exp(-((tt - centre) ** 2) / (2 * 0.12 ** 2))
        out += bp(x, f * 0.7, f * 1.4) * w
    return out


def sfx(kind, dur=None):
    if kind == "ping":
        n = int(3 * SR); t = np.arange(n) / SR
        x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in [(880, 1, 1.4), (1760, 0.4, 2.5), (2640, 0.15, 4), (1318.5, 0.25, 2)])
        return x * np.minimum(1, t / 0.003) * 0.16, 0
    if kind in ("impact", "softImpact", "hit"):
        big = {"impact": 1.0, "softImpact": 0.55, "hit": 0.8}[kind]
        n = int(2.4 * SR); t = np.arange(n) / SR
        boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 9)) / SR) * np.exp(-t * (2.2 if kind != "hit" else 3.5))
        crack = lp(noise(n), 2500 if kind != "hit" else 4000) * np.exp(-t * 22) * 0.5
        x = np.tanh(1.6 * (boom + crack))
        if kind == "hit":
            x[: int(1.4 * SR)] += tom(80, 0.6, 3.0)
        return x * 0.5 * big, 0
    if kind in ("click", "tick"):
        n = int(0.06 * SR); t = np.arange(n) / SR
        x = bp(noise(n), 2500, 9000) * np.exp(-t * 160) + np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 90) * 0.3
        return x * 0.18, 0
    if kind == "whoosh":
        x = sweep_noise(1.0, 250, 6000) * np.hanning(int(1.0 * SR)) ** 1.5
        return x * 0.22, -0.65
    if kind == "swish":
        x = sweep_noise(0.5, 900, 9000, 8) * np.hanning(int(0.5 * SR)) ** 1.5
        return x * 0.16, -0.3
    if kind == "shimmer":
        out = np.zeros(int(3 * SR))
        for i, m in enumerate([81, 86, 88, 93, 98]):
            s_ = piano(hz(m), 1.5, 0.3, 1.3)
            i0 = int(i * 0.045 * SR); out[i0:i0 + len(s_)] += s_[: len(out) - i0]
        return out * 0.55, 0
    if kind == "riser":
        n = int(dur * SR); t = np.arange(n) / SR
        p = t / dur
        x = sweep_noise(dur, 300, 9000, 14) * p ** 2
        x += np.sin(2 * np.pi * np.cumsum(180 + 700 * p ** 2) / SR) * p ** 3 * 0.25
        return x * 0.22, 0
    if kind == "reverse":
        n = int(dur * SR); t = np.arange(n) / SR
        x = hp(noise(n), 2500) * (t / dur) ** 3 + lp(noise(n), 800) * (t / dur) ** 4 * 0.5
        return x * 0.22, 0
    if kind == "glitch":
        n = int(0.2 * SR)
        x = np.zeros(n)
        for j in range(0, n, int(0.02 * SR)):
            f = rs.choice([180, 420, 900, 2200, 3600])
            seg = np.sign(np.sin(2 * np.pi * f * np.arange(min(int(0.02 * SR), n - j)) / SR)) * rs.uniform(0.2, 1)
            if rs.random() < 0.35:
                seg = noise(len(seg)) * 0.6
            x[j:j + len(seg)] = seg
        x = np.round(x * 6) / 6  # « bitcrush »
        return hp(x, 150) * np.exp(-np.arange(n) / SR * 9) * 0.14, -0.02
    if kind == "typing":
        out = np.zeros(int(dur * SR) + SR)
        tt = 0.0
        while tt < dur:
            n = int(0.03 * SR)
            k_ = bp(noise(n), 1500, 7000) * np.exp(-np.arange(n) / SR * 220) * rs.uniform(0.6, 1)
            i0 = int(tt * SR); out[i0:i0 + n] += k_
            tt += rs.uniform(0.055, 0.12)
        return out * 0.12, 0
    raise ValueError(kind)


for c in CUES:
    sig, off = sfx(c["sfx"], c.get("dur"))
    pan = {"swish": 0.3, "whoosh": -0.2, "glitch": float(rs.uniform(-0.5, 0.5))}.get(c["sfx"], 0.0)
    add(fx, sig, c["t"] + off, pan=pan)
fx = reverb(fx, reverb_ir(2.2, 6000, 3), 0.3)
fx *= np.clip((DUR - np.arange(N) / SR) / 1.5, 0, 1)

(ROOT / "assets" / "audio" / "music").mkdir(parents=True, exist_ok=True)
(ROOT / "assets" / "audio" / "sfx").mkdir(parents=True, exist_ok=True)


def save(x, path):
    peak = np.max(np.abs(x))
    x = x / peak * 0.89 if peak > 0.89 else x
    sf.write(path, x.T.astype(np.float32), SR)
    print(f"{path.relative_to(ROOT)}  crête {20 * np.log10(np.max(np.abs(x)) + 1e-9):.1f} dBFS")


save(mus, ROOT / "assets" / "audio" / "music" / "music.wav")
save(fx, ROOT / "assets" / "audio" / "sfx" / "sfx.wav")
