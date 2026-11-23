import sys,re,html,json,subprocess,time
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
db={}
try: db=json.load(open('research/mixkit.json'))
except: pass
for q in sys.argv[1:]:
    for page in (1,):
        url=f"https://mixkit.co/free-stock-video/discover/{q}/"+(f"?page={page}" if page>1 else "")
        s=subprocess.run(["curl","-sL","-A",UA,"-m","30",url],capture_output=True,text=True).stdout
        found=0
        for m in re.finditer(r'href="/free-stock-video/([a-z0-9-]+)-(\d+)/" class="item-grid-video-player__overlay-link">\s*([^<]+?)\s*</a>',s):
            slug,vid,title=m.groups(); found+=1
            if vid not in db: db[vid]={"q":q,"title":html.unescape(title)}; print(vid,q,'|',html.unescape(title))
        if found<20: break
        time.sleep(3)
json.dump(db,open('research/mixkit.json','w'),ensure_ascii=False,indent=0)
