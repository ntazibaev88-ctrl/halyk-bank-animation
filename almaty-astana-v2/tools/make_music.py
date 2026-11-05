"""Procedural cinematic score + transition SFX (D minor), ducked under narration. Output: assets/audio/score.wav"""
import numpy as np, wave, os
from scipy import signal
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import json
TLD = json.load(open(f"{R}/tools/timeline.json")); SC = TLD['scenes']; SR = 48000; DUR = TLD['total']; N = int(SR*DUR)
rng = np.random.default_rng(7)
t = np.arange(N)/SR
def env(n, a, r):  # simple AR envelope
    e = np.ones(n); na=int(a*SR); nr=int(r*SR)
    e[:na]=np.linspace(0,1,na); e[-nr:]=np.minimum(e[-nr:],np.linspace(1,0,nr)); return e
def lp(x, f, order=2): b,a = signal.butter(order, f/(SR/2)); return signal.lfilter(b,a,x)
def saw(f, n, det=(0,)):
    tt=np.arange(n)/SR; y=0
    for d in det: y = y + signal.sawtooth(2*np.pi*f*(1+d/1200)*tt)
    return y/len(det)
mix = np.zeros((2,N))
def add(x, at, pan=0.0, g=1.0):
    i=int(at*SR); x=x[:max(0,N-i)]
    mix[0,i:i+len(x)] += x*g*(1-max(0,pan)); mix[1,i:i+len(x)] += x*g*(1+min(0,pan))
# --- harmony: Dm | Bb | F | C  (each 4 beats at 72bpm ≈ 3.33s) ---
BPM=72; beat=60/BPM; bar=4*beat
chords=[[50,53,57,62],[46,50,53,58],[41,45,48,53+12-12+0],[48,52,55,60]]
chords=[[62,65,69,74],[58,62,65,70],[65,69,72,77],[60,64,67,72]]
bassn=[38,34,41,36]
mf=lambda m:440*2**((m-69)/12)
nbars=int(DUR/bar)+1
# intensity curve over the film
def inten(tm):
    lv={'opening':.5,'map':.5,'almaty':.62,'astana':.7,'climate':.72,'life':.78,'board':.95,'finale':1.0}
    pts=[(0,.5)]+[(sc['start']+sc['dur']*.5,lv[sc['id']]) for sc in SC]+[(DUR-2.5,.8),(DUR,.2)]
    return np.interp(tm,[p[0] for p in pts],[p[1] for p in pts])
for b in range(nbars):
    tb=b*bar; c=chords[b%4]; n=int(bar*SR*1.15)
    # pad
    pad=sum(saw(mf(m),n,(-9,0,9)) for m in c)/4
    pad=lp(pad, 700+1800*inten(tb))*env(n,1.2,1.5)*0.16*inten(tb)
    add(pad,tb,0.0)
    # sub bass
    bs=np.sin(2*np.pi*mf(bassn[b%4])*np.arange(n)/SR)+0.4*np.sin(2*np.pi*mf(bassn[b%4])*2*np.arange(n)/SR)
    add(bs*env(n,0.05,1.0)*0.34*min(1,inten(tb)+.2),tb)
    # arpeggio pluck (fm bell) 8ths
    for k in range(8):
        tk=tb+k*beat/2
        if tk>=DUR: break
        m=c[[0,1,2,3,2,1,2,3][k]]+12
        ln=int(1.4*SR); tt=np.arange(ln)/SR; f=mf(m)
        y=np.sin(2*np.pi*f*tt+1.6*np.exp(-4*tt)*np.sin(2*np.pi*f*2*tt))*np.exp(-3.2*tt)
        add(y*0.09*inten(tk)*(0.6 if k%2 else 1), tk, pan=(-0.4 if k%2 else 0.4))
    # strings swell on every 4th bar high
    if b%4==3:
        sw=sum(saw(mf(m+12),n,(-12,0,12)) for m in c[:3])/3
        add(lp(sw,2400)*env(n,bar*0.9,0.4)*0.07*inten(tb),tb,0.0)
# rhythmic low drums in final build (55-70) & gentle pulse elsewhere
def drum(f0,ln=0.6,g=1.0):
    n=int(ln*SR); tt=np.arange(n)/SR; f=f0*(1+2.5*np.exp(-18*tt))
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-6*tt)*g
for k in range(int(DUR/beat)):
    tk=k*beat
    if SC[6]['start']<=tk<SC[7]['start']+2:
        add(drum(55,0.7,0.5),tk)
        if k%2: add(lp(rng.normal(size=int(.25*SR)),5000)*np.exp(-np.arange(int(.25*SR))/SR*22)*0.12,tk+beat/2)
    elif SC[1]['start']<=tk<SC[6]['start'] and k%4==0: add(drum(48,0.8,0.3),tk)
# braam/impact hits at scene starts
def impact(g=1.0):
    n=int(3.0*SR); tt=np.arange(n)/SR
    y=drum(40,3.0,1.0)*0.9+lp(rng.normal(size=n),900)*np.exp(-tt*2.5)*0.5
    return y*g
for tm,g in [(0,.9)]+[(sc['start'],.55) for sc in SC[1:]]:
    add(impact(g),tm,0,0.6)
# transitions: reversed noise riser + whoosh just before each cut
def riser(ln):
    n=int(ln*SR); nz=rng.normal(size=n); out=np.zeros(n); 
    for i in range(0,n,2400):
        fc=300+ 9000*(i/n)**2; out[i:i+2400]=lp(nz[i:i+2400]*1.0,fc,1)
    return out*np.linspace(0,1,n)**2.2
for tm in [sc['start'] for sc in SC[1:]]:
    add(riser(1.1),tm-1.1,0,0.22); 
    w=lp(rng.normal(size=int(.7*SR)),6000)*np.hanning(int(.7*SR)*2)[int(.7*SR):]*0.25
    add(w,tm,0.3,0.5)
# small whooshes at in-scene cuts (every ~2s inside 15–35 shot scenes)
for tm in [x for sc in SC[2:4] for x in [sc['start']+q for q in range(3,int(sc['dur'])-1,4)]]:
    n=int(.45*SR); w=lp(rng.normal(size=n),4500)*np.sin(np.linspace(0,np.pi,n))*0.18
    add(w,tm-0.2,0.5 if (tm//2)%2 else -0.5,0.5)
# tail reverb
ir=rng.normal(size=int(2.4*SR))*np.exp(-np.arange(int(2.4*SR))/SR*1.6); ir[0]=0
for ch in range(2):
    wet=signal.fftconvolve(mix[ch],ir*0.012)[:N]; mix[ch]=mix[ch]*0.8+wet*1.0
# --- ducking under narration ---
w=wave.open(f"{R}/assets/vo/narration.wav"); vo=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
vo=np.pad(vo,(0,max(0,N-len(vo))))[:N]
e=np.abs(vo); e=lp(e,6,1)  # smooth ~ 6Hz
e=np.clip(e/ (np.percentile(e,95)+1e-9),0,1)
duck=1-0.62*np.clip(lp(e,3,1)*1.6,0,1)
mix*=duck
# fade in/out, normalize to -22 dBFS-ish RMS (narration sits ~ -14 LUFS)
mix*=np.minimum(1,t/0.4)*np.clip((DUR-t)/2.5,0,1)
mix=np.tanh(mix*1.2)
rms=np.sqrt(np.mean(mix**2)); mix*=10**(-24/20)/rms
mix=np.clip(mix,-0.98,0.98)
out=(mix.T*32767).astype(np.int16)
os.makedirs(f"{R}/assets/audio",exist_ok=True)
with wave.open(f"{R}/assets/audio/score.wav","wb") as o: o.setnchannels(2);o.setsampwidth(2);o.setframerate(SR);o.writeframes(out.tobytes())
print("ok", out.shape)
