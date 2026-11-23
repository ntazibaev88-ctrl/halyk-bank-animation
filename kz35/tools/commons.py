import sys,re,html,json,subprocess,time,urllib.parse,os
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
def get(url):
    return subprocess.run(["curl","-sL","-A",UA,"-m","40",url],capture_output=True,text=True).stdout
def search(q,typ="video",limit=100):
    u="https://commons.wikimedia.org/w/index.php?"+urllib.parse.urlencode({"search":q+(" filetype:video" if typ=="video" else (" filetype:bitmap" if typ=="image" else (" filetype:audio" if typ=="audio" else ""))),"title":"Special:Search","ns6":"1","limit":limit,"fulltext":"1","profile":"advanced"})
    s=get(u)
    out=[]
    for m in re.finditer(r'<li class="mw-search-result[\s\S]*?</li>',s):
        b=m.group(0)
        t=re.search(r'title="(File:[^"]+)"',b)
        d=re.search(r'class="searchresult"[^>]*>([\s\S]*?)</div>',b)
        meta=re.search(r'class="mw-search-result-data"[^>]*>([^<]*)<',b)
        if t: out.append((html.unescape(t.group(1)), html.unescape(meta.group(1)) if meta else "", re.sub('<[^>]+>','',html.unescape(d.group(1)))[:120] if d else ""))
    return out
def fileinfo(title):
    s=get("https://commons.wikimedia.org/wiki/"+urllib.parse.quote(title.replace(' ','_')))
    orig=re.search(r'href="(https://upload\.wikimedia\.org/wikipedia/commons/[0-9a-f]/[0-9a-f]{2}/[^"]+)"',s)
    lic=re.findall(r'class="licensetpl_short[^"]*"[^>]*>([^<]+)<',s) or re.findall(r'(Public domain|CC BY[- A-Z0-9.]+|CC0)',s)
    date=re.search(r'id="fileinfotpl_date"[\s\S]*?<td[^>]*>([\s\S]*?)</td>',s)
    auth=re.search(r'id="fileinfotpl_aut"[\s\S]*?<td[^>]*>([\s\S]*?)</td>',s)
    desc=re.search(r'class="description[^"]*"[^>]*>([\s\S]*?)</div>',s)
    clean=lambda x: re.sub(r'\s+',' ',re.sub('<[^>]+>','',html.unescape(x))).strip()[:300] if x else ""
    fm=re.search(r'class="fileInfo">([\s\S]*?)</span>',s)
    return dict(fileinfo=clean(fm.group(1)) if fm else "",title=title,url=orig.group(1) if orig else None,license=list(dict.fromkeys(lic))[:3],date=clean(date.group(1)) if date else "",author=clean(auth.group(1)) if auth else "",desc=clean(desc.group(1)) if desc else "")
if __name__=="__main__":
    mode=sys.argv[1]
    if mode=="search":
        typ=sys.argv[2]
        for q in sys.argv[3:]:
            print("==",q)
            for r in search(q,typ): print("  ",r[0],"|",r[1],"|",r[2][:90])
            time.sleep(0.5)
    elif mode=="info":
        for t in sys.argv[2:]: print(json.dumps(fileinfo(t),ensure_ascii=False))
