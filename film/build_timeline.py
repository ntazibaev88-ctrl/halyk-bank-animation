import json,subprocess
L=json.load(open("vo/lines.json"))
INTRO,GAP,SGAP,OUTRO=1.3,0.42,0.95,4.7
t=INTRO; scenes={}; prev=None
for r in L:
    if prev is not None: t+= SGAP if r["scene"]!=prev else GAP
    d=r["out"]-r["in"]; r["start"]=round(t,3); r["end"]=round(t+d,3)
    r["wt"]=[[round(t+w[0]-r["in"],3),round(t+w[0]+w[1]-r["in"],3),w[2]] for w in r["words"]]
    scenes.setdefault(r["scene"],[t,0])[1]=t+d
    t+=d; prev=r["scene"]
total=round(t+OUTRO,2)
# scene boundaries: cut midway through the inter-scene gap
ks=sorted(scenes); bounds=[]
for i,k in enumerate(ks):
    a=0 if i==0 else (scenes[ks[i-1]][1]+scenes[k][0])/2
    b=total if i==len(ks)-1 else (scenes[k][1]+scenes[ks[i+1]][0])/2
    bounds.append(dict(scene=k,start=round(a,3),end=round(b,3)))
json.dump(dict(total=total,lines=L,scenes=bounds),open("build/timeline.json","w"),ensure_ascii=False,indent=1)
for b in bounds: print(b)
print("total",total)
# assemble VO track
inp=[];f=[]
for i,r in enumerate(L):
    inp+=["-i",r["file"]]
    f.append(f"[{i}:a]atrim={r['in']}:{r['out']},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={r['out']-r['in']-0.06}:d=0.06,adelay={int(r['start']*1000)}:all=1[a{i}]")
f.append("".join(f"[a{i}]" for i in range(len(L)))+f"amix=inputs={len(L)}:normalize=0,apad=whole_dur={total},aresample=48000[o]")
subprocess.run(["ffmpeg","-v","error","-y",*inp,"-filter_complex",";".join(f),"-map","[o]","-ac","1","build/vo_raw.wav"],check=True)
