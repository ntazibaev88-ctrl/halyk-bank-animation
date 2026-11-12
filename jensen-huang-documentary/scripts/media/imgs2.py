import hashlib,urllib.parse,subprocess,os,time,re
names={
"dennys_1970s":"Denny's in the 1970s.jpg",
"tainan_1960s":"Tainan 1960s.jpg",
"taipei_night_1960s":"1960s台北市中華商場夜景.jpg",
"diner_doyles":"Doyle's Diner Interior North.jpg",
"dennys_oregon":"Denny's Restaurant Sign in Ontario, Oregon.jpg",
"diner_salem":"Salem Oak Diner Interior 01.jpg",
"gf256_die_a":"NVIDIA@220nm@Fixed-pipline@NV10@GeForce 256@T5A3202220008 S1 Taiwan A Stack-DSC04127-DSC04166 - ZS-retouched (30132426001).jpg",
}
time.sleep(630)
for k,n in names.items():
    out=f"img/{k}.jpg"
    if os.path.exists(out) and os.path.getsize(out)>5000: continue
    fn=n.replace(" ","_"); h=hashlib.md5(fn.encode()).hexdigest()
    url=f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(fn)}"
    for a in range(6):
        r=subprocess.run(["curl","-sS","-D","hdr.txt","-o",out,"-w","%{http_code}","-A","DocumentaryRenderer/1.0 (educational, low-volume)",url],capture_output=True,text=True)
        code=r.stdout.strip()
        print(k,code,flush=True)
        if code=="200": break
        m=re.search(r"retry-after: (\d+)",open("hdr.txt").read(),re.I)
        time.sleep(int(m.group(1))+15 if m else 120)
    time.sleep(12)
print("DONE",flush=True)
