"""Extrait l'historique RÉEL du dépôt du site (git log) vers config/history.json.

Ces données (dates, heures, messages de commit) sont affichées telles quelles
dans la scène « Le chemin » : rien n'est inventé. Relancer après de nouveaux
commits :  python3 tools/history.py   (nécessite l'historique : git fetch --depth=1000)
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
out = subprocess.run(
    ["git", "log", "--reverse", "--format=%h|%ad|%s", "--date=format:%Y-%m-%d|%H:%M", "--", ".", ":(exclude)video"],
    cwd=ROOT.parent, capture_output=True, text=True, check=True).stdout
commits = []
for line in out.strip().splitlines():
    h, d, t, msg = line.split("|", 3)
    commits.append({"hash": h, "date": d, "time": t, "message": msg})
data = {"_doc": "Généré par tools/history.py depuis git log du site (hors dossier video/). Ne pas éditer à la main.",
        "repository": "papaaliounefall/nej-digital", "count": len(commits), "commits": commits}
(ROOT / "config" / "history.json").write_text(json.dumps(data, indent=2, ensure_ascii=False))
print(f"{len(commits)} commits → config/history.json")
