import json,subprocess,sys,os,concurrent.futures as cf
d=json.load(open('videos.json'))
UA="DocumentaryRenderer/1.0 (educational)"
def src(key,orig=False):
    t=[k for k in d if key in k][0]; v=d[t]
    if orig: return v['url']
    ds=[x for x in v['derivs'] if x[1]==1080 and 'webm' in x[2]]
    return ds[0][0] if ds else v['url']
# name, title-key, start, dur, use original
C=[("modi","PM Modi",10,32,False),
   ("qct_gh","QCT shows",6,12,True),("qct_board","QCT shows",196,12,True),("qct_srv","QCT shows",220,10,True),
   ("dc_fiber","Data Center Tour",608,14,True),("dc_chiller","Data Center Tour",384,14,True),("dc_aisle","Data Center Tour",720,14,True),
   ("dd_racks","Decommissioned",182,12,True),("dd_fiber","Decommissioned",113,10,True),
   ("gb_mobo","Gigabyte AmpereOne",458,12,True),("gb_srv","Gigabyte AmpereOne",644,12,True),("gb_racks","Gigabyte AmpereOne",582,12,True),
   ("rtx_a","RTX 5090 FE",24,10,True),("rtx_b","RTX 5090 FE",62,10,True),("rtx_c","RTX 5090 FE",82,14,True),
   ("nvbooth","COMPUTEX NV",18,42,True),
   ("die_a","GT218",185,16,False),("die_b","GT218",298,16,False),
   ("crt_a","Commodore 1701",92,12,False),("crt_grid","Commodore 1701",1008,10,False),("crt_b","Commodore 1701",158,10,False),
   ("robot","Robot package",0,8,True),("diner_st","Northside Diner",68,14,False)]
def get(c):
    name,key,s,dur,orig=c; out=f"raw/{name}.mp4"
    if os.path.exists(out) and os.path.getsize(out)>10000: return name,"cached"
    r=subprocess.run(["ffmpeg","-v","error","-user_agent",UA,"-ss",str(s),"-i",src(key,orig),"-t",str(dur),*(["-c:a","aac"] if name=="diner_st" else ["-an"]),
       "-vf","scale=-2:'min(1080,ih)'" if not orig else "scale=-2:'min(2160,ih)'","-c:v","libx264","-preset","veryfast","-crf","16","-pix_fmt","yuv420p","-y",out],capture_output=True,text=True,timeout=900)
    return name,(r.stderr[-300:] or "ok")
with cf.ThreadPoolExecutor(3) as ex:
    for n,res in ex.map(get,C): print(n,res,flush=True)
