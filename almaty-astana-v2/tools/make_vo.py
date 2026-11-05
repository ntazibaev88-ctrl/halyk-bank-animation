"""Synthesize narration per sentence with RHVoice (male 'artemiy'), apply broadcast EQ, emit timings.json."""
import json, subprocess, wave, sys, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
script = json.load(open(f"{R}/tools/script.json"))
VOICE, RATE = "artemiy", float(sys.argv[1]) if len(sys.argv) > 1 else 92
# pause (s) after each segment; scene-boundary pauses are longer
PAUSE = {"s1":0.9,"s2a":0.5,"s2b":0.9,"s3a":0.5,"s3b":0.9,"s4a":0.5,"s4b":0.9,"s5a":0.5,"s5b":0.9,"s6a":0.5,"s6b":0.9,"s7a":0.5,"s7b":0.9,"s8a":0.7,"s8b":0.0}
for s in script:
    raw = f"/tmp/vo_{s['id']}.wav"
    subprocess.run(["RHVoice-test","-p",VOICE,"-r",str(int(RATE)),"-t","92","-o",raw],input=s["text"].encode(),check=True,stderr=subprocess.DEVNULL)
    w = wave.open(raw); s["dur"] = w.getnframes()/w.getframerate()
# fixed scene-aligned start times (seconds) so narration lands on each scene
START = {"s1":0.5,"s2a":5.3,"s2b":11.1,"s3a":15.4,"s3b":20.0,"s4a":25.4,"s4b":31.6,"s5a":35.5,"s5b":40.4,"s6a":46.0,"s6b":50.8,"s7a":55.9,"s7b":63.0,"s8a":70.6,"s8b":75.2}
lst = []
for s in script:
    s["start"] = START[s["id"]]; s["end"] = round(s["start"]+s["dur"],3)
    lst.append((s["start"], f"/tmp/vo_{s['id']}.wav"))
    assert s["end"] < max([START[k] for k in START if START[k] > s["start"]] + [99]) - 0.2, s["id"]
inputs=[]; filt=[]
for i,(st,f) in enumerate(lst):
    inputs += ["-i",f]; filt.append(f"[{i}]adelay={int(st*1000)}:all=1[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(lst)))
chain = (";".join(filt) + f";{mix}amix=inputs={len(lst)}:normalize=0,"
  "highpass=f=70,equalizer=f=140:t=q:w=1:g=3,equalizer=f=3500:t=q:w=1.2:g=2,"
  "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=4,"
  "aecho=0.8:0.5:55:0.12,loudnorm=I=-14:TP=-1.5:LRA=7[v]")
subprocess.run(["ffmpeg","-y","-v","error",*inputs,"-filter_complex",chain,"-map","[v]","-ar","48000",f"{R}/assets/vo/narration.wav"],check=True)
json.dump(script, open(f"{R}/tools/timings.json","w"), ensure_ascii=False, indent=1)
print("end of speech", script[-1]["end"])
for s in script: print(s["id"], s["start"], s["end"])
