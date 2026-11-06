import numpy as np, sys
from ru_tts import Voice, text_to_phonemes
from narration import SCENES
def f0(x, sr):
    fr=int(0.04*sr); hop=int(0.01*sr); vals=[]
    for i in range(0,len(x)-fr,hop):
        s=x[i:i+fr]; 
        if np.sqrt((s**2).mean())<0.03: continue
        s=s-s.mean(); ac=np.correlate(s,s,'full')[fr-1:]
        lo,hi=int(sr/300),int(sr/60); k=lo+np.argmax(ac[lo:hi])
        if ac[k]>0.3*ac[0]: vals.append(sr/k)
    return np.median(vals)
for v in sys.argv[1:]:
    V=Voice(v); tot=[]
    allx=[]
    for sid,a,b,cl in SCENES:
        d=0
        for txt,p in cl:
            x=V.synth(text_to_phonemes(txt)); allx.append(x); d+=len(x)/V.sr+p
        tot.append((sid,round(d,2),b-a))
    X=np.concatenate(allx)
    print(v,"F0",round(f0(X[:V.sr*20],V.sr),1),"peak",round(float(np.abs(X).max()),2),tot, "total",round(sum(t[1] for t in tot),1))
