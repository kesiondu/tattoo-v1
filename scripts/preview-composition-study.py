"""Offline design-first feasibility study. Run with Python, Pillow and NumPy."""
from pathlib import Path
from urllib.request import Request, urlopen
from io import BytesIO

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

BASE = "https://assets.tattoogenerator.online/v1/"
OUT = Path(__file__).resolve().parents[1] / ".logs" / "composition-study"
CASES = [
    ("Ankle / floral", "foot-ankle/top-outer-foot-ankle", "gallery/ornamental-flower-tattoo-artwork.webp", (.66, .78), (.16, .16)),
    ("Chest / Japanese", "chest-torso/male-front-torso", "gallery/japanese-fox-and-kitsune-mask-tattoo-artwork.webp", (.36, .4), (.26, .23)),
    ("Upper arm / watercolor", "arm/outer-arm", "dialog-examples/watercolor-paper.webp", (.55, .22), (.18, .23)),
]


def asset(path):
    request = Request(BASE + path, headers={"User-Agent": "Mozilla/5.0", "Origin": "https://tattoogenerator.online"})
    with urlopen(request, timeout=25) as response:
        layer = Image.open(BytesIO(response.read())).convert("RGBA")
        return Image.alpha_composite(Image.new("RGBA", layer.size, "white"), layer).convert("RGB")


def compose(body, art, polygon, *, pigment_mix=False):
    mask = Image.new("L", body.size)
    ImageDraw.Draw(mask).polygon(polygon, fill=255)
    x0, y0, x1, y1 = mask.getbbox()
    fitted = ImageOps.contain(art, (x1-x0, y1-y0), Image.Resampling.LANCZOS)
    w, h = fitted.size
    # Cylindrical approximation. Compress the motif near the surface edges.
    axis = np.linspace(-1, 1, w)
    source = (np.arcsin(axis * .72) / np.arcsin(.72) + 1) * (w-1)/2
    coordinate = np.broadcast_to(source, (h, w))
    pixels = np.asarray(fitted, dtype=float)
    lo = coordinate.astype(int)
    frac = (coordinate-lo)[..., None]
    rows = np.arange(h)[:, None]
    ink = pixels[rows, lo]*(1-frac) + pixels[rows, np.minimum(lo+1,w-1)]*frac
    x, y = (x0+x1-w)//2, (y0+y1-h)//2
    region = np.asarray(body.crop((x,y,x+w,y+h)), dtype=float)
    washed = np.clip(ink/245, 0, 1)
    blended = region * (.18 + .82*washed)
    if pigment_mix:
        # Keep neutral outlines and white paper unchanged. Use local skin
        # luminance to modulate scattering from the colored pigment layer.
        light = (region @ np.array([.2126, .7152, .0722]))[..., None] / 255
        chroma = np.ptp(washed, axis=2, keepdims=True)
        coverage = np.clip(chroma * 2.8, 0, 1)
        weight = coverage * (.10 + .38 * (1-light))
        pigment = washed * (112 + 135*light)
        blended = blended*(1-weight) + pigment*weight
    patch = Image.fromarray(np.uint8(np.clip(blended, 0, 255)))
    edited = body.copy()
    edited.paste(patch, (x,y))
    preview = Image.composite(edited, body, mask)
    delta = np.any(np.asarray(preview) != np.asarray(body), axis=2)
    outside = np.count_nonzero(delta & (np.asarray(mask)==0))
    assert outside == 0 and np.any(delta)
    return preview, int(delta.sum()), outside


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sheet = Image.new("RGB", (780, 3*277), "white")
    draw = ImageDraw.Draw(sheet)
    for i,(label,view,path,center,size) in enumerate(CASES):
        body = asset(f"tattoo-generator/body-references/{view}/medium.webp")
        art = asset(path)
        box = art.convert("L").point(lambda v: 255 if v < 215 else 0).getbbox()
        art = art.crop(box)
        w,h = body.size
        polygon = [(round(w*(center[0]+size[0]*np.cos(t)/2)),round(h*(center[1]+size[1]*np.sin(t)/2))) for t in np.linspace(0,2*np.pi,40,endpoint=False)]
        result, changed, outside = compose(body, art, polygon)
        gray = art.convert("L").filter(ImageFilter.MedianFilter(3))
        # Local contrast picks the dark side of edges instead of tracing skin.
        line = Image.fromarray(np.where(np.asarray(gray.filter(ImageFilter.MaxFilter(5)),dtype=int)-np.asarray(gray)>30,0,255).astype("uint8"))
        result.save(OUT/f"preview-{i+1}.png")
        line.save(OUT/f"reference-{i+1}.png")
        for j,img in enumerate((art,result,line)):
            thumb = ImageOps.contain(img,(252,248))
            sheet.paste(thumb,(260*j+(260-thumb.width)//2,277*i+23))
        draw.text((6,277*i+4),label,fill="black")
        print(label, "changed:",changed,"outside:",outside)
    sheet.save(OUT/"comparison.png")


if __name__ == "__main__":
    main()
