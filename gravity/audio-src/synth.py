import json, re, numpy as np, soundfile as sf
from piper import PiperVoice, SynthesisConfig
d="/home/user/voices/vits-piper-ru_RU-ruslan-medium"
voice=PiperVoice.load(f"{d}/ru_RU-ruslan-medium.onnx",config_path=f"{d}/ru_RU-ruslan-medium.onnx.json",include_alignments=True)
LS=float(__import__('sys').argv[1]) if len(__import__('sys').argv)>1 else 1.0
script=json.load(open("script.json")); out=[]
for sc in script:
    tot=0
    for i,line in enumerate(sc["lines"]):
        clean=line.replace("[","").replace("]","")
        chunks=list(voice.synthesize(clean,SynthesisConfig(length_scale=LS,noise_scale=0.6,noise_w_scale=0.75),include_alignments=True))
        x=np.concatenate([c.audio_float_array for c in chunks]); sr=chunks[0].sample_rate
        fn=f"vo/s{sc['scene']}_{i}.wav"; sf.write(fn,x,sr)
        # phoneme words with times
        t=0; words=[]; cur=""; cs=None
        for c in chunks:
            for a in c.phoneme_alignments:
                dur=a.num_samples/sr
                if a.phoneme==" ":
                    if cur: words.append((cur,cs,t)); cur=""; cs=None
                else:
                    if a.phoneme not in "^$_" and cs is None and not re.match(r"[,.!?:;—…]",a.phoneme): cs=t
                    if not re.match(r"[,.!?:;—…\^\$_]",a.phoneme): cur+=a.phoneme
                t+=dur
            if cur: words.append((cur,cs,t)); cur=""; cs=None
        tw=[w for w in re.findall(r"[\wёЁ\-]+",clean) if w!="—"]
        out.append({"scene":sc["scene"],"i":i,"text":line,"file":fn,"dur":round(len(x)/sr,3),"ph":[(w,round(s,3),round(e,3)) for w,s,e in words],"nwords":len(tw)})
        tot+=len(x)/sr
        print(sc["scene"],i,round(len(x)/sr,2),len(words),len(tw),"|"," ".join(w for w,_,_ in words))
    print("scene",sc["scene"],"speech",round(tot,2),"window",round(sc["end"]-sc["start"],2))
json.dump(out,open("vo.json","w"),ensure_ascii=False,indent=1)
