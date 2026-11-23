import sys,json,subprocess,urllib.parse,re,os,time
sys.path.insert(0,'tools'); import commons
UA="KZ35DocumentaryBuilder/1.0 (non-commercial educational video; curl)"
res=[]
for t in sys.argv[2:]:
    i=commons.fileinfo(t); u=i['url'].split('?')[0]
    p=u.split('/wikipedia/commons/')[1]; d,n=p.rsplit('/',1)
    for w in (int(sys.argv[1]),2560,1920,1280):
        tu=f"https://upload.wikimedia.org/wikipedia/commons/thumb/{d}/{n}/{w}px-{n}"
        out=f"assets/img/{re.sub(r'[^A-Za-z0-9]+','_',n)[:50]}.jpg"
        r=subprocess.run(["curl","-s","-A",UA,"-m","60","-o",out,"-w","%{http_code}",tu],capture_output=True,text=True)
        if r.stdout=="200" and os.path.getsize(out)>5000: break
    i['local']=out; i['thumb_code']=r.stdout; res.append(i); print(r.stdout,w,out,i['license'][:2],i['fileinfo'][:60],flush=True)
    time.sleep(1)
db=json.load(open('research/images.json')) if os.path.exists('research/images.json') else []
json.dump(db+res,open('research/images.json','w'),ensure_ascii=False,indent=1)
