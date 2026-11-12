import hashlib,urllib.parse,subprocess,os
names={
"dennys_1970s":"Denny's in the 1970s.jpg",
"dennys_oregon":"Denny's Restaurant Sign in Ontario, Oregon.jpg",
"dennys_brooklyn":"Denny's Restaurant in Brooklyn NY.jpg",
"diner_doyles":"Doyle's Diner Interior North.jpg",
"diner_doyles_s":"Doyle's Diner Interior South.jpg",
"diner_exmore":"Exmore Diner Interior North.jpg",
"diner_salem":"Salem Oak Diner Interior 01.jpg",
"diner_highspire":"Highspire Diner Interior 01.jpg",
"jh_computex2010":"Jensen Huang at Computex Taipei 20100531.jpg",
"jh_2023":"Jensen Huang 20231109.jpg",
"jh_gtcjapan":"Jensen Huang at GTC Japan 20161005.jpg",
"jh_gesture":"Nvidia CEO Jensen Huang gestikuliert.jpg",
"jh_2024":"Jensen Huang (cropped) (2024).jpg",
"jh_computex2016a":"Jensen Huang at Computex Taipei 20160531a.jpg",
"jh_computex2016c":"Jensen Huang at Computex Taipei 20160531c.jpg",
"gf256_die_a":"NVIDIA@220nm@Fixed-pipline@NV10@GeForce 256@T5A3202220008 S1 Taiwan A Stack-DSC04127-DSC04166 - ZS-retouched (30132426001).jpg",
"gf256_die_b":"NVIDIA@220nm@Fixed-pipline@NV10@GeForce 256@T5A3202220008 S1 Taiwan A Stack-DSC04190-DSC04306 - ZS-retouched (29587965214).jpg",
"gf256_die_c":"NVIDIA@220nm@Fixed-pipline@NV10@GeForce 256@T5A3202220008 S1 Taiwan A Stack-DSC04352-DSC04423 - ZS-retouched (29588366273).jpg",
"gf256_card":"VisionTek GeForce 256.jpg",
"tainan_1960s":"Tainan 1960s.jpg",
"taipei_night_1960s":"1960s台北市中華商場夜景.jpg",
"taipei_1964":"Taipei guest house in 1964years.jpg",
"obi_sign":"OBI Sign 01.jpg",
}
for k,n in names.items():
    fn=n.replace(" ","_"); h=hashlib.md5(fn.encode()).hexdigest()
    url=f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(fn)}"
    out=f"img/{k}.jpg"
    if not os.path.exists(out):
        import time
        for a in range(8):
            r=subprocess.run(["curl","-sS","-f","-A","DocumentaryRenderer/1.0 (educational)","-o",out,url],capture_output=True)
            if r.returncode==0: break
            time.sleep(10*(a+1))
        print(k,r.returncode,flush=True); time.sleep(2)
