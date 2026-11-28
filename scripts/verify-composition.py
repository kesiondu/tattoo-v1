"""Read an anonymized front-torso lasso (normalized image coordinates) on stdin."""
import json
import runpy
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageOps

study = runpy.run_path(str(Path(__file__).with_name("preview-composition-study.py")))
out = study["OUT"]
points = json.load(sys.stdin)
assert len(points) >= 3 and all(0 <= p[k] <= 1 for p in points for k in ("x","y"))
art = Image.open(sys.argv[1]).convert("RGB")
rgb = np.asarray(art)
border = np.concatenate((rgb[:8].reshape(-1,3),rgb[-8:].reshape(-1,3),rgb[:,:8].reshape(-1,3),rgb[:,-8:].reshape(-1,3)))
print("points",len(points),"border pixels below white-key threshold",int((border.min(axis=1)<245).sum()),"/",len(border))
art = art.crop(art.convert("L").point(lambda v: 255 if v < 215 else 0).getbbox())
sheet = Image.new("RGB",(720,480),"white")
comparison = Image.new("RGB", (720,900), "white")
for i,tone in enumerate(("natural-fair","warm-ivory","medium-light","medium","medium-dark","dark")):
    body = study["asset"](f"tattoo-generator/body-references/chest-torso/male-front-torso/{tone}.webp")
    w,h = body.size
    poly = [(round(p["x"]*(w-1)),round(p["y"]*(h-1))) for p in points]
    preview,changed,outside = study["compose"](body,art,poly)
    candidate,_,outside_new = study["compose"](body,art,poly,pigment_mix=True)
    x,y = zip(*poly)
    bounds = (min(x),min(y),max(x)+1,max(y)+1)
    crop = ImageOps.contain(preview.crop(bounds),(218,202))
    left,top = i%3*240,i//3*240
    sheet.paste(crop,(left+(240-crop.width)//2,top+26))
    ImageDraw.Draw(sheet).text((left+10,top+6),tone,fill="black")
    print(tone,changed,"changed;",outside,"outside")
    for variant,img in enumerate((preview,candidate)):
        sample = ImageOps.contain(img.crop(bounds),(226,192))
        xoff, yoff = i%3*240, (i//3*2+variant)*225
        comparison.paste(sample,(xoff+(240-sample.width)//2,yoff+24))
        ImageDraw.Draw(comparison).text((xoff+8,yoff+5),f"{tone} / {('original','pigment')[variant]}",fill="black")
    assert outside_new == outside == 0
sheet.save(out/"six-tones-koi.png")
comparison.save(out/"pigment-comparison.png")
