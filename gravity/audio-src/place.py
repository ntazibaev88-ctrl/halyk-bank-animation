import json, numpy as np, soundfile as sf, subprocess
vo=json.load(open("vo.json")); script=json.load(open("script.json"))
SR=22050; total=90.0; track=np.zeros(int(total*SR))
lines=[]
for sc in script:
    L=[v for v in vo if v["scene"]==sc["scene"]]
    speech=sum(v["dur"] for v in L); n=len(L)
    win=sc["end"]-sc["start"]
    fixed_last = sc["scene"]==7
    if fixed_last:
        L2=L[:-1]; sp2=sum(v["dur"] for v in L2)
        gap=min(0.9,max(0.35,(84.6-sc["start"]-sp2)/(len(L2)-1)))
    else:
        gap=min(0.75,max(0.3,(win-speech-0.45)/max(1,n-1)))
    t=sc["start"]
    for k,v in enumerate(L):
        if fixed_last and k==n-1: t=85.7
        x,sr=sf.read(v["file"]); i=int(round(t*SR)); track[i:i+len(x)]+=x
        words=[]
        toks=v["text"].replace("—"," ").split()
        # map text tokens (keeping bracket marks) to phoneme words
        assert len(toks)==len(v["ph"]),(toks,v["ph"])
        for tok,(ph,s,e) in zip(toks,v["ph"]):
            words.append({"w":tok,"s":round(t+s,3),"e":round(t+e,3)})
        lines.append({"scene":sc["scene"],"i":k,"start":round(t,3),"end":round(t+v["dur"],3),"text":v["text"],"words":words})
        print(sc["scene"],k,round(t,2),"->",round(t+v["dur"],2))
        t+=v["dur"]+gap
    assert t-gap<=sc["end"]+0.01, sc
sf.write("vo_raw.wav",track,SR)
json.dump(lines,open("timing.json","w"),ensure_ascii=False,indent=1)
