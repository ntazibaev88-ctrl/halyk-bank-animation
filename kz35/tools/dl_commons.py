import json,subprocess,os,time,sys
UA="KZ35DocumentaryBuilder/1.0 (non-commercial educational video; curl)"
info=json.load(open('research/candidates_info.json'))
order=[int(x) for x in sys.argv[1:]] if len(sys.argv)>1 else range(len(info))
for k in order:
    i=info[k]; out=i['local']
    if os.path.exists(out) and os.path.getsize(out)>20000: print('have',out,flush=True); continue
    for attempt in range(8):
        r=subprocess.run(["curl","-sL","-A",UA,"-m","1200","-o",out,"-w","%{http_code}",i['dl_url']],capture_output=True,text=True)
        code=r.stdout.strip()
        if code=="200" and os.path.getsize(out)>20000: print('ok',out,os.path.getsize(out),i['title'][:60],flush=True); break
        print('retry',code,out,flush=True); 
        if os.path.exists(out): os.remove(out)
        time.sleep(640)
    time.sleep(20)
print('DONE',flush=True)
