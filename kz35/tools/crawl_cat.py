import re,html,subprocess,urllib.parse,json,sys,time
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36"
def get(u): return subprocess.run(["curl","-sL","-A",UA,"-m","40",u],capture_output=True,text=True).stdout
seen=set(); files={}
def crawl(cat,depth):
    if cat in seen or depth<0: return
    seen.add(cat)
    u="https://commons.wikimedia.org/wiki/"+urllib.parse.quote(cat.replace(' ','_'))
    while u:
        s=get(u)
        sub=re.search(r'id="mw-subcategories"([\s\S]*?)(id="mw-category-media"|id="catlinks"|$)',s)
        subs=re.findall(r'href="/wiki/(Category:[^"]+)"',sub.group(1)) if sub else []
        med=re.search(r'id="mw-category-media"([\s\S]*?)id="catlinks"',s)
        if med:
            for f in re.findall(r'href="/wiki/(File:[^"]+\.(?:webm|ogv|mp4|mpg|mpeg|ogg))"',med.group(1),re.I):
                f=urllib.parse.unquote(f).replace('_',' ')
                files.setdefault(f,cat)
        nxt=re.search(r'href="([^"]+filefrom=[^"]+)"[^>]*>next page',s)
        u=("https://commons.wikimedia.org"+html.unescape(nxt.group(1))) if nxt else None
        for c in dict.fromkeys(subs):
            crawl(urllib.parse.unquote(c).replace('_',' '),depth-1)
for c in sys.argv[2:]: crawl(c,int(sys.argv[1]))
json.dump(files,open('research/commons_files.json','w'),ensure_ascii=False,indent=0)
for f,c in sorted(files.items(),key=lambda x:x[1]): print(c,'|',f)
print(len(files),'files',len(seen),'cats')
