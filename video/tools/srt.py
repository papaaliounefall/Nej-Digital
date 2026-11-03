"""Génère output/NEJ-Digital_soustitres.srt depuis config/story.json + timings de la voix.
Utile pour importer les sous-titres dans TikTok / Reels / Shorts ou un logiciel de montage."""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
story = json.loads((ROOT / "config/story.json").read_text())
tm = {t["id"]: t for t in json.loads((ROOT / "assets/audio/vo/timings.json").read_text())}
def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"
out = []
for i, n in enumerate(story["narration"], 1):
    t = tm[n["id"]]
    out.append(f"{i}\n{ts(t['start'])} --> {ts(t['end'] + 0.3)}\n{n['text'].replace('*', '')}\n")
p = ROOT / "output" / "NEJ-Digital_soustitres.srt"
p.write_text("\n".join(out), encoding="utf-8")
print(p.relative_to(ROOT))
