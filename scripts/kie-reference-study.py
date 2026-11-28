"""Run three billed reference jobs. Reuse the output directory to resume."""
import argparse
import json
import time
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument("key_file", type=Path)
parser.add_argument("out", type=Path)
args = parser.parse_args()
args.out.mkdir(parents=True, exist_ok=True)
key = args.key_file.read_text(encoding="utf-8-sig").strip()
cases = {"flower": "fine-line botanical wildflower sprig, fine continuous black ink",
         "koi": "Japanese koi fish, vermilion scales and indigo water, bold outlines",
         "watercolor": "pale watercolor iris with translucent lavender petals and sage leaves"}

def api(path, payload=None):
    req = Request("https://api.kie.ai/api/v1/jobs/"+path,
                  data=json.dumps(payload).encode() if payload else None,
                  headers={"Authorization":"Bearer "+key,"Content-Type":"application/json","User-Agent":"Mozilla/5.0"})
    with urlopen(req, timeout=60) as response:
        data = json.load(response)
    if data["code"] != 200:
        raise RuntimeError(f"Kie {data['code']}: {str(data.get('msg',''))[:150].replace(key,'[redacted]')}")
    return data["data"]

def run(name):
    ticket = args.out/(name+".job")
    file = args.out/(name+".png")
    if not file.exists():
        if not ticket.exists():
            prompt = "Single isolated flat tattoo flash illustration: "+cases[name]+". Pure solid white background, generous empty margins. No skin, lettering, shadow, framing or paper texture."
            ticket.write_text(api("createTask", {"model":"nano-banana-pro","input":{"prompt":prompt,"aspect_ratio":"1:1","resolution":"1K","output_format":"png"}})["taskId"])
        print(name,"submitted",flush=True)
        for _ in range(150):
            data = api("recordInfo?taskId="+ticket.read_text().strip())
            if data["state"]=="success":
                url = json.loads(data["resultJson"])["resultUrls"][0]
                with urlopen(Request(url,headers={"User-Agent":"Mozilla/5.0"}),timeout=60) as response:
                    Image.open(BytesIO(response.read())).convert("RGB").save(file)
                break
            if data["state"]=="fail":
                raise RuntimeError(f"{name}: provider failed ({data.get('failCode')})")
            time.sleep(5)
    art = Image.open(file).convert("RGB")
    rgb = np.asarray(art)
    edge = np.concatenate([rgb[0],rgb[-1],rgb[:,0],rgb[:,-1]])
    print(name,"white-key border coverage",round(100*np.mean(edge.min(1)>=245),2),"%",flush=True)
    gray = art.convert("L").filter(ImageFilter.MedianFilter(3))
    line = Image.fromarray(np.where(np.asarray(gray.filter(ImageFilter.MaxFilter(5)),int)-np.asarray(gray)>30,0,255).astype("uint8"))
    line.save(args.out/(name+"-line.png"))
    skin = np.array([165,117,89])
    mounted = Image.fromarray(np.uint8(skin*(.18+.82*np.clip(rgb/245,0,1))))
    return [art,mounted,line]

with ThreadPoolExecutor(3) as pool:
    rows = list(pool.map(run,cases))
sheet = Image.new("RGB",(780,822),"white")
draw = ImageDraw.Draw(sheet)
for i,(name,row) in enumerate(zip(cases,rows)):
    for j,img in enumerate(row):
        draw.text((260*j+4,274*i+2),f"{name} / {('source','white-key sample','reference')[j]}",fill="black")
        sheet.paste(ImageOps.contain(img,(254,250)),(260*j+3,274*i+20))
sheet.save(args.out/"review.png")
