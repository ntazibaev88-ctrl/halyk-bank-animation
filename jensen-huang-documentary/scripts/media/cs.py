import json,sys,urllib.error,urllib.request,urllib.parse,re
UA={"User-Agent":"DocumentaryRenderer/1.0 (educational)"}
def q(term,n=25,ftype=None):
    s=term+(f" filetype:{ftype}" if ftype else "")
    p={"action":"query","generator":"search","gsrsearch":s,"gsrnamespace":6,"gsrlimit":n,"prop":"imageinfo","iiprop":"url|size|mime|extmetadata","format":"json"}
    import time
    for k in range(8):
        try:
            r=urllib.request.urlopen(urllib.request.Request("https://commons.wikimedia.org/w/api.php?"+urllib.parse.urlencode(p),headers=UA),timeout=30); break
        except urllib.error.HTTPError as e:
            if e.code!=429: raise
            time.sleep(20*(k+1))
    time.sleep(3)
    d=json.load(r)
    for pg in d.get("query",{}).get("pages",{}).values():
        ii=pg["imageinfo"][0]; m=ii.get("extmetadata",{})
        lic=m.get("LicenseShortName",{}).get("value","?")
        art=re.sub("<[^>]+>","",m.get("Artist",{}).get("value","?"))[:40]
        print(f"{ii['width']}x{ii['height']} {ii.get('duration','')} | {lic} | {art} | {pg['title']}")
for a in sys.argv[1:]:
    t,_,f=a.partition("@"); print("==",a); q(t,ftype=f or None)
