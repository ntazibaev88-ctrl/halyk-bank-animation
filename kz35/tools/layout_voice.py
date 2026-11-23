import json,subprocess
segs=json.load(open('voice/segs.json'))
START=1.0; END_TARGET=117.0
gaps=[]
for k in range(1,len(segs)):
    if segs[k]['scene']!=segs[k-1]['scene']: gaps.append(1.15)
    elif segs[k-1]['scene']==1 and segs[k-1]['idx']==0: gaps.append(0.9)
    else: gaps.append(0.5)
speech=sum(s['b']-s['a'] for s in segs)
base=START+speech+sum(gaps)
extra=END_TARGET-base
print('speech',round(speech,2),'base end',round(base,2),'extra',round(extra,2))
# distribute extra proportionally to gaps
tg=sum(gaps); gaps=[g+extra*g/tg for g in gaps]
t=START
for k,s in enumerate(segs):
    s['start']=round(t,3); s['end']=round(t+s['b']-s['a'],3)
    s['words_abs']=[dict(w=w['w'],t=round(t+w['t']-s['a'],3),d=w['d']) for w in s['words']]
    t=s['end']+(gaps[k] if k<len(gaps) else 0)
json.dump(segs,open('voice/timeline.json','w'),ensure_ascii=False,indent=1)
# build filter
inputs=[];flt=[]
for k,s in enumerate(segs):
    inputs+=['-i',s['file']]
    d=int(s['start']*1000)
    flt.append(f"[{k}:a]atrim={s['a']}:{s['b']},asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.02,afade=t=out:st={s['b']-s['a']-0.05:.3f}:d=0.05,adelay={d}|{d}[v{k}]")
mix="".join(f"[v{k}]" for k in range(len(segs)))+f"amix=inputs={len(segs)}:normalize=0[dry]"
chain="[dry]highpass=f=70,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.2:g=1.2,deesser=i=0.3,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,aecho=0.8:0.25:38|61:0.06|0.04,aresample=48000,aformat=channel_layouts=stereo,apad[out]"
cmd=['ffmpeg','-y','-v','error']+inputs+['-filter_complex',";".join(flt+[mix,chain]),'-map','[out]','-t','120','-c:a','pcm_s24le','-ar','48000','voice/vo_tmp.wav']
subprocess.run(cmd,check=True)
import re
o=subprocess.run(['ffmpeg','-i','voice/vo_tmp.wav','-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
I=float(re.findall(r'I:\s+(-?[\d.]+) LUFS',o)[-1]); g=-16.0-I; print('gain',g)
subprocess.run(['ffmpeg','-y','-v','error','-i','voice/vo_tmp.wav','-af',f'volume={g:.2f}dB,alimiter=limit=0.84:attack=3:release=50:level=0,asetpts=N/SR/TB,apad=whole_len=5760000,atrim=end_sample=5760000','-c:a','pcm_s24le','-ar','48000','out/KAZAKHSTAN_VOICEOVER.wav'],check=True)
for s in segs: print(s['scene'],s['idx'],s['start'],s['end'],s['text'][:50])
