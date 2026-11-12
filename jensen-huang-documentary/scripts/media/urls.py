import json,sys,urllib.request,urllib.parse,time,urllib.error
UA={"User-Agent":"DocumentaryRenderer/1.0 (educational)"}
titles=[l.strip() for l in open(sys.argv[1]) if l.strip()]
out={}
for i in range(0,len(titles),5):
    p={"action":"query","titles":"|".join(titles[i:i+5]),"prop":"videoinfo","viprop":"url|size|derivatives|extmetadata|mime","format":"json"}
    for k in range(8):
        try:
            d=json.load(urllib.request.urlopen(urllib.request.Request("https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(p),headers=UA),timeout=30));break
        except urllib.error.HTTPError as e:
            print("429 wait",flush=True); time.sleep(15*(k+1))
    time.sleep(3)
    norm={n["to"]:n["from"] for n in d["query"].get("normalized",[])}
    for pg in d["query"]["pages"].values():
        if "videoinfo" not in pg: print("MISSING",pg.get("title")); continue
        v=pg["videoinfo"][0]; m=v.get("extmetadata",{})
        out[pg["title"]]={"url":v["url"],"w":v["width"],"h":v["height"],"dur":v.get("duration"),
          "derivs":[(x["src"],x.get("height"),x["type"]) for x in v.get("derivatives",[])],
          "license":m.get("LicenseShortName",{}).get("value"),"artist":m.get("Artist",{}).get("value"),
          "descurl":v.get("descriptionurl")}
json.dump(out,open(sys.argv[2],"w"),ensure_ascii=False,indent=1)
print(len(out))
