"""Compose the Kie study originals against the three public placement fixtures."""
import sys
import runpy
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

study = runpy.run_path(str(Path(__file__).with_name("preview-composition-study.py")))
out = Path(sys.argv[1])
sheet = Image.new("RGB", (816, 888), "white")
for i,(case,name) in enumerate(zip(study["CASES"],("flower","koi","watercolor"))):
    label, view, _, center, extent = case
    body = study["asset"](f"tattoo-generator/body-references/{view}/medium.webp")
    art = Image.open(out/(name+".png")).convert("RGB")
    bounds = art.convert("L").point(lambda v: 255 if v < 215 else 0).getbbox()
    art = art.crop(bounds)
    poly = [(round(body.width*(center[0]+extent[0]*np.cos(t)/2)), round(body.height*(center[1]+extent[1]*np.sin(t)/2))) for t in np.linspace(0,2*np.pi,50,endpoint=False)]
    preview, changed, outside = study["compose"](body, art, poly, pigment_mix=True)
    print(name, "changed",changed,"outside",outside)
    x,y = zip(*poly)
    detail = preview.crop((min(x)-10,min(y)-10,max(x)+11,max(y)+11))
    reference = Image.open(out/(name+"-line.png")).crop(bounds)
    for j,(title,img) in enumerate((("Placement",preview),("Detail",detail),("Line reference",reference))):
        thumb = ImageOps.contain(img,(260,260))
        sheet.paste(thumb,(j*272+(272-thumb.width)//2,i*296+24))
        ImageDraw.Draw(sheet).text((j*272+6,i*296+4),f"{name} / {title}",fill="black")
sheet.save(out/"placement.png")
