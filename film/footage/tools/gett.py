import json,subprocess,os,sys,time,re
UA="KZ35DocBot/1.0 (documentary asset research; python-urllib)"
sel=json.load(open("../sources.json"))
man=json.load(open("manifest_commons.json")); bytitle={v["title"]:k for k,v in man.items()}
order=sys.argv[1:]
items=sorted([(bytitle[t],v) for t,v in sel.items() if t in bytitle and bytitle[t].split(".")[0] in order],key=lambda x:order.index(x[0].split(".")[0]))
for out,v in items:
    out=out.rsplit(".",1)[0]+".webm"
    if os.path.exists(out) and os.path.getsize(out)>100000: continue
    url=v["url"].split("?")[0]; fn=url.rsplit("/",1)[1]; base=url.replace("/commons/","/commons/transcoded/")+f"/{fn}."
    h=min(v["w"],v["h"]) if v["w"] and v["h"] else 720
    qs=[q for q in (2160,1440,1080,720,480,360,240) if q<=h][:3]
    ok=False
    for q in qs:
        for a in range(6):
            time.sleep(12)
            hdr=out+".hdr"
            r=subprocess.run(["curl","-sS","-m","900","-D",hdr,"-A",UA,"-o",out,"-w","%{http_code} %{size_download}",f"{base}{q}p.vp9.webm"],capture_output=True,text=True)
            ra=re.search(r"retry-after: (\d+)",open(hdr).read().lower()); os.remove(hdr)
            print(out,q,r.stdout,"retry-after",ra and ra.group(1),flush=True)
            if r.stdout.startswith("200"): ok=True; break
            os.remove(out)
            if r.stdout.startswith("404"): break
            time.sleep(min(int(ra.group(1)) if ra else 30,120))
        if ok: break
