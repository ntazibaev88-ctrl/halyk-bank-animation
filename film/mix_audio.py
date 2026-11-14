# Voice + original score + synthesized steppe wind -> build/audio.wav (48k stereo, about -14 LUFS)
import json, subprocess, numpy as np, scipy.io.wavfile as w, scipy.signal as sg
T=json.load(open("build/timeline.json")); TOTAL=T["total"]; SC={s["scene"]:(s["start"],s["end"]) for s in T["scenes"]}
sr=48000; n=int(TOTAL*sr); rng=np.random.default_rng(11)
# wind: band-limited noise with slow gusts
def wind(seed):
    r=np.random.default_rng(seed); x=r.normal(0,1,n)
    b,a=sg.butter(2,[180/(sr/2),900/(sr/2)],btype="band"); y=sg.lfilter(b,a,x)
    b2,a2=sg.butter(1,2200/(sr/2)); y+=0.25*sg.lfilter(b2,a2,r.normal(0,1,n))
    t=np.arange(n)/sr; g=0.55+0.25*np.sin(2*np.pi*t/7.3+seed)+0.2*np.sin(2*np.pi*t/3.1+2*seed)
    return y*g
env=np.zeros(n); t=np.arange(n)/sr
def seg(a,b,lv,f=1.5): 
    global env; env=np.maximum(env, lv*np.clip((t-a)/f,0,1)*np.clip((b-t)/f,0,1))
seg(0,SC[1][1]+1,1.0,2.0); seg(SC[2][0],SC[2][1],0.5); seg(SC[8][1]-3,TOTAL-1.5,0.55,2.5)
W=np.stack([wind(1),wind(2)],1)*env[:,None]; W=W/np.abs(W).max()*0.11
w.write("build/wind.wav",sr,(W*32767).astype(np.int16))
fc=(
 # voice: gentle cleanup, warmth, compression, small room
 "[0:a]highpass=f=70,equalizer=f=160:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=8:release=140:makeup=3,aformat=channel_layouts=stereo,asplit=3[v1][v2][vk];"
 "[v2]aecho=0.8:0.25:38|71:0.10|0.07,volume=0.5[vr];[v1][vr]amix=inputs=2:normalize=0[vo];"
 f"[1:a]atrim=0:{TOTAL},highshelf=f=7000:g=-2,volume=1.25[m0];"
 "[m0][vk]sidechaincompress=threshold=0.02:ratio=5:attack=40:release=650:makeup=1[md];"
 "[2:a]volume=1.0[wd];"
 f"[vo][md][wd]amix=inputs=3:normalize=0:weights='1.35 0.62 1',afade=t=in:d=0.8,afade=t=out:st={TOTAL-1.6}:d=1.6,volume=-1.8dB,alimiter=limit=0.87:attack=4:release=60:level=disabled,aresample=48000[o]"
)
subprocess.run(["ffmpeg","-v","error","-y","-i","build/vo_raw.wav","-i","music/score_raw.wav","-i","build/wind.wav","-filter_complex",fc,"-map","[o]","-t",str(TOTAL),"build/audio.wav"],check=True)
# report voice vs bed balance
def rms(f,flt):
    o=subprocess.run(["ffmpeg","-hide_banner","-i",f,"-af",flt+"volumedetect","-f","null","-"],capture_output=True,text=True).stderr
    return [l.split(":")[1].strip() for l in o.splitlines() if "mean_volume" in l or "max_volume" in l]
print("final mix",rms("build/audio.wav",""))
