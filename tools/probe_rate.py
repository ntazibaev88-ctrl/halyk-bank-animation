import json,subprocess,sys,wave,numpy as np
rate=sys.argv[1]
s=json.load(open('narration/script.json'))
def trimmed(f):
    w=wave.open(f);sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16)
    idx=np.where(np.abs(x)>300)[0]; return (idx[-1]-idx[0])/sr
tot=0;n=0
for seg in s['segments']:
  for i,x in enumerate(seg['sentences']):
    f=f"/tmp/claude-0/p.wav"
    subprocess.run(['RHVoice-test','-p','aleksandr-hq','-r',rate,'-o',f],input=x['tts'].encode(),check=True)
    tot+=trimmed(f);n+=1
print(rate,round(tot,1),n)
