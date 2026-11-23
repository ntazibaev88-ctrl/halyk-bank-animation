import json,subprocess,os,re,sys
RATE=sys.argv[1] if len(sys.argv)>1 else "+4%"
N=json.load(open('narration.json'))
os.makedirs('voice/seg',exist_ok=True)
def spoken(t): return t.replace("1986","мың тоғыз жүз сексен алтыншы").replace("1991","мың тоғыз жүз тоқсан бірінші").replace(" 16 "," он алтыншы ")
def dur(f): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f]))
def speech_end(f):
    out=subprocess.run(["ffmpeg","-i",f,"-af","silencedetect=n=-50dB:d=0.1","-f","null","-"],capture_output=True,text=True).stderr
    starts=[float(x) for x in re.findall(r"silence_start: ([\d.]+)",out)]
    ends=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",out)]
    D=dur(f); s0=ends[0] if starts and starts[0]<0.02 and ends else 0.0
    e=D
    if starts and starts[-1]>s0+0.2 and (len(starts)>len(ends) or ends[-1]>=D-0.03): e=starts[-1]
    return s0,e
segs=[]
for s in N:
  for i,t in enumerate(s['sentences']):
    raw=f"voice/seg/s{s['scene']}_{i}.mp3"
    if not os.path.exists(raw+'.done'+RATE):
      subprocess.run(["python3","tools/tts.py",spoken(t),raw,RATE],check=True); open(raw+'.done'+RATE,'w')
    a,b=speech_end(raw)
    segs.append(dict(scene=s['scene'],idx=i,text=t,file=raw,a=max(0,a-0.03),b=b+0.06,words=json.load(open(raw+'.json'))))
json.dump(segs,open('voice/segs.json','w'),ensure_ascii=False,indent=1)
print(sum(x['b']-x['a'] for x in segs), len(segs))
