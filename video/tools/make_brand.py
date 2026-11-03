"""Prépare les calques du logo officiel NEJ Digital pour l'animation.

Source : ../public/icon-512.png (le logo officiel du site, fond noir).
Le logo n'est PAS redessiné : il est vectorisé (potrace) à partir du fichier
officiel, puis séparé par couleur pour pouvoir animer chaque partie :

  assets/brand/logo-nej.svg       logo complet (vectoriel)
  assets/brand/logo-letters.svg   « NEJ » blanc (sans les carrés bleus)
  assets/brand/logo-squares.svg   les deux carrés bleus
  assets/brand/logo-digital.svg   « — DIGITAL — » bleu
  assets/brand/brand.json         couleurs mesurées + boîtes englobantes

Usage : python3 tools/make_brand.py
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image
import potrace  # paquet pip « potracer »

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "public" / "icon-512.png"
OUT = ROOT / "assets" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

SCALE = 4  # vectorisation sur une version agrandie = courbes plus fidèles

img = Image.open(SRC).convert("RGB")
big = img.resize((img.width * SCALE, img.height * SCALE), Image.LANCZOS)
a = np.asarray(big).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
lum = a.mean(axis=2)

white = (lum > 150) & (np.abs(r - b) < 60)
blue = (b > 150) & (b - r > 90)

# Couleur bleue réelle du logo (médiane des pixels bleus francs)
src = np.asarray(img).astype(np.int32)
bm = (src[..., 2] > 200) & (src[..., 2] - src[..., 0] > 150)
blue_rgb = tuple(int(v) for v in np.median(src[bm], axis=0))
blue_hex = "#%02X%02X%02X" % blue_rgb

# Boîte du logo complet
ys, xs = np.where(white | blue)
x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
W, H = x1 - x0, y1 - y0

# Séparation des parties bleues : carrés (dans la hauteur des lettres) / DIGITAL (dessous)
wy = np.where(white.any(axis=1))[0]
letters_bottom = wy.max()
squares = blue.copy(); squares[letters_bottom + 2 * SCALE:, :] = False
digital = blue.copy(); digital[: letters_bottom + 2 * SCALE, :] = False


def to_path(mask):
    bmp = potrace.Bitmap(~mask[y0:y1, x0:x1])  # potrace : « sombre » = plein
    plist = bmp.trace(turdsize=8, alphamax=1.0, opticurve=True, opttolerance=0.2)
    parts = []
    for curve in plist:
        s = curve.start_point
        d = [f"M{s.x:.1f},{s.y:.1f}"]
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
            else:
                d.append(
                    f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} "
                    f"{seg.end_point.x:.1f},{seg.end_point.y:.1f}"
                )
        d.append("Z")
        parts.append("".join(d))
    return " ".join(parts)


def bbox(mask):
    yy, xx = np.where(mask[y0:y1, x0:x1])
    return [round(float(xx.min()) / W, 5), round(float(yy.min()) / H, 5),
            round(float(xx.max() + 1) / W, 5), round(float(yy.max() + 1) / H, 5)]


def svg(paths):
    body = "".join(f'<path fill="{c}" fill-rule="evenodd" d="{d}"/>' for d, c in paths)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'width="{W}" height="{H}">{body}</svg>')


p_white, p_sq, p_dig = to_path(white), to_path(squares), to_path(digital)
(OUT / "logo-letters.svg").write_text(svg([(p_white, "#FFFFFF")]))
(OUT / "logo-squares.svg").write_text(svg([(p_sq, blue_hex)]))
(OUT / "logo-digital.svg").write_text(svg([(p_dig, blue_hex)]))
(OUT / "logo-nej.svg").write_text(svg([(p_white, "#FFFFFF"), (p_sq, blue_hex), (p_dig, blue_hex)]))

# Boîtes de chaque carré bleu (pour les animer séparément)
from scipy import ndimage
lab, n = ndimage.label(squares[y0:y1, x0:x1])
square_boxes = []
for i in range(1, n + 1):
    yy, xx = np.where(lab == i)
    if len(yy) < 200:
        continue
    square_boxes.append([round(float(xx.min()) / W, 5), round(float(yy.min()) / H, 5),
                         round(float(xx.max() + 1) / W, 5), round(float(yy.max() + 1) / H, 5)])
square_boxes.sort()

meta = {
    "source": "public/icon-512.png",
    "aspect": round(W / H, 5),
    "logoBlue": blue_hex,
    "boxes": {"letters": bbox(white), "squares": square_boxes, "digital": bbox(digital)},
}
(OUT / "brand.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
print(json.dumps(meta, indent=2))
