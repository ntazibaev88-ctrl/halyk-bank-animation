"""Download freely licensed clips from Wikimedia Commons (sequential, polite, with retries).
Usage: python3 scripts/fetch_commons.py <key>=<File:Title> [...]
Saves footage/raw/<key>.<ext> and appends license metadata to footage/sources.jsonl"""
import json, os, subprocess, sys, time, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "DocumentaryClipFinder/1.0 (non-commercial research script; python-curl)"
RAW = os.path.join(ROOT, "footage/raw"); os.makedirs(RAW, exist_ok=True)

def api(title):
    p = {"action": "query", "format": "json", "titles": title, "prop": "videoinfo",
         "viprop": "url|size|derivatives|extmetadata", "viextmetadatafilter": "LicenseShortName|Artist|Credit|LicenseUrl"}
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)
    for i in range(12):
        out = subprocess.run(["curl", "-sS", "-A", UA, url], capture_output=True, text=True).stdout
        try:
            return list(json.loads(out)["query"]["pages"].values())[0]
        except Exception:
            time.sleep(5 + 4 * i)
    raise RuntimeError("api failed " + title)

def get(url, dest):
    for i in range(int(os.environ.get("TRIES", "40"))):
        r = subprocess.run(["curl", "-sS", "-L", "-A", UA, "-o", dest + ".part", "-w", "%{http_code}", url], capture_output=True, text=True)
        if r.stdout.strip() == "200":
            os.replace(dest + ".part", dest); return True
        print("  http", r.stdout.strip(), "retry", i, flush=True); time.sleep(float(os.environ.get("WAIT", "180")))
    return False

for arg in sys.argv[1:]:
    key, title = arg.split("=", 1)
    page = api(title); vi = page["videoinfo"][0]
    src = vi["url"].split("?")[0]
    # prefer a 1080p transcode for very large originals
    if vi["size"] > 150 * 2**20:
        for d in vi.get("derivatives", []):
            if "1080p" in d["src"] and d["src"].endswith(".webm"):
                src = d["src"]; break
    ext = os.path.splitext(src)[1] or ".webm"
    dest = os.path.join(RAW, key + ext)
    if not os.path.exists(dest):
        print("GET", key, src[-90:], flush=True)
        ok = get(src, dest)
        print("  ->", "ok" if ok else "FAILED", flush=True)
    m = vi.get("extmetadata", {})
    rec = {"key": key, "file": os.path.basename(dest), "source": "Wikimedia Commons", "title": page["title"],
           "page": "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(page["title"].replace(" ", "_")),
           "license": m.get("LicenseShortName", {}).get("value"), "author": m.get("Artist", {}).get("value", "")}
    with open(os.path.join(ROOT, "footage/sources.jsonl"), "a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    time.sleep(2)
