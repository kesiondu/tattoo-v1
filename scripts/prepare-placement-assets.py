"""Build alpha-preserving PNGs for the Worker from the site's public WebP templates."""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import re
from urllib.request import Request, urlopen
from PIL import Image

root = Path(__file__).resolve().parents[1]
catalog = (root/"scripts/download-body-references.mjs").read_text()
views = re.findall(r"\['([a-z-]+)', '([a-z-]+)'\]", catalog)
tones = re.findall(r"'([a-z-]+)'", catalog.split("const SKIN_TONES = [")[1].split("]")[0])

def prepare(path):
    target = root/"public/placement-v1"/(path+".png")
    if target.exists():
        return
    url = "https://assets.tattoogenerator.online/v1/tattoo-generator/body-references/"+path+".webp"
    with urlopen(Request(url,headers={"User-Agent":"Mozilla/5.0","Origin":"https://tattoogenerator.online"}),timeout=30) as response:
        image = Image.open(BytesIO(response.read())).convert("RGBA")
    image.thumbnail((850,850),Image.Resampling.LANCZOS)
    if image.getchannel("A").getextrema() != (0,255):
        raise ValueError("Missing silhouette: "+path)
    target.parent.mkdir(parents=True,exist_ok=True)
    image.save(target)

with ThreadPoolExecutor(6) as pool:
    list(pool.map(prepare,[f"{p}/{v}/{t}" for p,v in views for t in tones]))
