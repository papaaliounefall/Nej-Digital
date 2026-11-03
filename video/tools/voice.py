"""Piste de narration : enregistrements réels si présents, sinon voix de synthèse provisoire.

Pour chaque réplique de config/story.json :
  1. si assets/audio/vo/recorded/<id>.wav existe → c'est la vraie voix (prioritaire) ;
  2. sinon → synthèse Piper hors-ligne (voix provisoire) dans assets/audio/vo/<id>.wav.

Une prise de synthèse déjà générée est réutilisée tant que son texte ne change pas
(--force pour tout resynthétiser).

Produit aussi assets/audio/vo/timings.json (début/durée de chaque réplique),
lu par le moteur pour synchroniser les sous-titres, et par mix.py.

Pré-requis synthèse : pip install sherpa-onnx==1.12.40 soundfile numpy
et le modèle Piper extrait dans $PIPER_DIR (par défaut ~/tts) :
  https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-tom-medium.tar.bz2
"""
import json
import os
import re
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
STORY = json.loads((ROOT / "config" / "story.json").read_text())
VO = ROOT / "assets" / "audio" / "vo"
REC = VO / "recorded"
VO.mkdir(parents=True, exist_ok=True)
REC.mkdir(parents=True, exist_ok=True)
SR = 48000


def resample(x, sr_in, sr_out=SR):
    if sr_in == sr_out:
        return x
    from scipy.signal import resample_poly
    g = np.gcd(sr_in, sr_out)
    return resample_poly(x, sr_out // g, sr_in // g)


def trim(x, thr=0.006, pad=0.04):
    """Retire les silences de début/fin (garde un petit souffle)."""
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(pad * SR))
    b = min(len(x), idx[-1] + int(pad * SR * 3))
    return x[a:b]


def fade(x, ms=12):
    n = int(SR * ms / 1000)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


_tts = None


def synth(text):
    global _tts
    import sherpa_onnx
    vcfg = STORY["voice"]
    if _tts is None:
        base = Path(os.environ.get("PIPER_DIR", Path.home() / "tts")) / f"vits-piper-{vcfg['model']}"
        if not base.exists():
            base = Path("/home/user/tts") / f"vits-piper-{vcfg['model']}"
        _tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=str(base / f"{vcfg['model']}.onnx"), tokens=str(base / "tokens.txt"),
                    data_dir=str(base / "espeak-ng-data"), length_scale=vcfg["lengthScale"],
                    noise_scale=0.6, noise_scale_w=0.75),
                num_threads=4)))
    for word, say in vcfg.get("pronunciation", {}).items():
        text = re.sub(rf"\b{re.escape(word)}\b", say, text)
    text = text.replace("…", ",").replace("*", "")
    a = _tts.generate(text, sid=vcfg["speaker"], speed=1.0)
    return resample(np.array(a.samples, dtype=np.float64), a.sample_rate)


import hashlib
import sys

FORCE = "--force" in sys.argv
prev = {}
if (VO / "timings.json").exists():
    prev = {t["id"]: t for t in json.loads((VO / "timings.json").read_text())}


def text_key(line):
    v = STORY["voice"]
    return hashlib.sha1(json.dumps([line["text"].replace("*", ""), v["model"], v["speaker"], v["lengthScale"],
                                    v.get("pronunciation")], ensure_ascii=False).encode()).hexdigest()[:12]


timings = []
for line in STORY["narration"]:
    rec = REC / f"{line['id']}.wav"
    out = VO / f"{line['id']}.wav"
    key = text_key(line)
    if rec.exists():
        x, sr = sf.read(rec, dtype="float64")
        if x.ndim > 1:
            x = x.mean(axis=1)
        x, source = fade(trim(resample(x, sr))), "enregistrement"
        x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
        sf.write(out, x.astype(np.float32), SR, subtype="PCM_16")
    elif not FORCE and out.exists() and prev.get(line["id"], {}).get("key") == key and prev[line["id"]].get("source") != "enregistrement":
        # La synthèse est légèrement aléatoire : on réutilise la prise existante si le texte n'a pas changé.
        x, _ = sf.read(out, dtype="float64")
        source = "synthèse provisoire (réutilisée)"
    else:
        x, source = fade(trim(synth(line["text"]))), "synthèse provisoire"
        x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
        sf.write(out, x.astype(np.float32), SR, subtype="PCM_16")
    dur = len(x) / SR
    timings.append({"id": line["id"], "start": line["start"], "duration": round(dur, 3),
                    "end": round(line["start"] + dur, 3), "source": source.split(" (")[0], "key": key})
    print(f"{line['id']}  {line['start']:6.2f}s → {line['start'] + dur:6.2f}s  ({dur:4.2f}s, {source})")

# Contrôle des chevauchements
for a, b in zip(timings, timings[1:]):
    if a["end"] > b["start"] - 0.15:
        print(f"⚠ {a['id']} déborde sur {b['id']} ({a['end']:.2f}s > {b['start']:.2f}s) — ajuster 'start' dans story.json")

(VO / "timings.json").write_text(json.dumps(timings, indent=2, ensure_ascii=False))
