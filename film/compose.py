# Original score for the film, rendered with FluidSynth + FluidR3_GM (MIT-licensed soundfont).
import json, mido, subprocess, random
random.seed(7)
T=json.load(open("build/timeline.json")); SC={s["scene"]:(s["start"],s["end"]) for s in T["scenes"]}; TOTAL=T["total"]
TPB=480
ev=[]  # (time, msg)
PROG={0:48,1:43,2:60,3:52,4:46,5:24,6:73,7:47,8:61,10:42,11:0}  # ch -> GM program
def note(ch,p,t,d,v):
    v=max(1,min(127,int(v))); ev.append((t,mido.Message("note_on",channel=ch,note=p,velocity=v))); ev.append((t+d,mido.Message("note_off",channel=ch,note=p,velocity=0)))
def cc(ch,c,t,val): ev.append((t,mido.Message("control_change",channel=ch,control=c,value=max(0,min(127,int(val))))))
def swell(ch,t0,t1,a,b,step=0.15):
    n=max(1,int((t1-t0)/step))
    for i in range(n+1): cc(ch,11,t0+(t1-t0)*i/n,a+(b-a)*i/n)
N={"C":0,"D":2,"E":4,"F":5,"G":7,"A":9,"B":11}
def P(s):  # "D3" "Bb2" "F#4"
    n=N[s[0]]; i=1
    if s[i]=="b": n-=1; i+=1
    elif s[i]=="#": n+=1; i+=1
    return 12*(int(s[i:])+1)+n
CH={"Dm":["D","F","A"],"Bb":["Bb","D","F"],"F":["F","A","C"],"C":["C","E","G"],"Gm":["G","Bb","D"],"Am":["A","C","E"],"A":["A","C#","E"],
    "D":["D","F#","A"],"G":["G","B","D"],"Bm":["B","D","F#"],"Em":["E","G","B"],"Asus":["A","D","E"]}
def bars(sc,prog,extra_end=0):
    a,b=SC[sc]; b+=extra_end; n=len(prog); L=(b-a)/n
    return [(a+i*L,L,prog[i]) for i in range(n)]
def pad(ch,t,L,chord,octs=(3,4),v=60,over=0.15):
    for o in octs:
        for nm in CH[chord]: note(ch,P(nm+str(o)),t,L+over,v)
def bass(t,L,chord,v=70,o=1): note(1,P(CH[chord][0]+str(o+1)),t,L+0.1,v); note(10,P(CH[chord][0]+str(o+1)),t,L+0.1,v-10)
def dombra(t,L,chord,v=78,top=None,beats=4):
    # galloping two-string strum: long-short-short
    r,_,f=CH[chord]; lo=P(r+"3"); hi=P(f+"3") if P(f+"3")>lo else P(f+"4")
    tp=top or hi
    b=L/beats
    for i in range(beats):
        for off,dur,acc in ((0,0.5,1.0),(0.5,0.25,0.72),(0.75,0.25,0.8)):
            tt=t+(i+off)*b+random.uniform(-0.006,0.006); vv=v*acc*(1.08 if i==0 and off==0 else 1)
            note(5,lo,tt,dur*b*0.95,vv); note(5,tp,tt+0.012,dur*b*0.95,vv*0.92)
def stacc(t,L,chord,v=64,div=8,o=4):
    ns=[P(n+str(o)) for n in CH[chord]]; b=L/div
    for i in range(div):
        note(0,ns[i%3] if i%4 else ns[0]-12, t+i*b, b*0.45, v*(1.1 if i%4==0 else 0.85))
def harp(t,L,chord,v=62,o=3,div=8):
    seq=[P(n+str(o+k)) for k in (0,1) for n in CH[chord]]+[P(CH[chord][0]+str(o+2))]
    pat=[0,2,3,4,6,4,3,2]; b=L/div
    for i in range(div): note(4,seq[pat[i%8]],t+i*b,b*2.5,v*(1 if i%4==0 else 0.8))
def melody(ch,t0,L,notes,v=80):
    # notes: list of (name, beats) over bars of 4 beats; L = bar length
    t=t0; b=L/4
    for nm,d in notes:
        if nm: note(ch,P(nm),t,d*b*0.97,v)
        t+=d*b
def timp(t,p="D2",v=90): note(7,P(p),t,1.2,v)
def roll(t0,t1,p="D2",a=30,b=100):
    n=int((t1-t0)/0.07)
    for i in range(n): note(7,P(p),t0+i*0.07,0.1,a+(b-a)*(i/n)**1.6)
def drum(t,k,v): ev.append((t,mido.Message("note_on",channel=9,note=k,velocity=max(1,min(127,int(v)))))); ev.append((t+0.3,mido.Message("note_off",channel=9,note=k,velocity=0)))
def pulse(t,L,v=70,beats=4):
    b=L/beats
    for i in range(beats):
        drum(t+i*b,41,v*(1.15 if i==0 else 0.8)); drum(t+(i+0.5)*b,43,v*0.5); drum(t+(i+0.75)*b,43,v*0.6)

THEME_m=[("D4",1.5),("F4",.5),("G4",1),("A4",1), ("A4",1.5),("C5",.5),("A4",1),("G4",1), ("F4",1.5),("G4",.5),("A4",1),("D5",1), ("C5",1),("A4",1),("G4",.5),("A4",1.5)]
THEME_M=[("D4",1.5),("F#4",.5),("G4",1),("A4",1), ("B4",1.5),("D5",.5),("B4",1),("A4",1), ("G4",1.5),("A4",.5),("B4",1),("D5",1), ("E5",1),("D5",1),("C#5",.5),("D5",1.5)]
def up(th,n=12): 
    inv={v:k for k,v in N.items()}
    return [(mido_name(P(a)+n),d) for a,d in th]
def mido_name(p):
    names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; return names[p%12]+str(p//12-1)

# ---- S1: mysterious opening ----
a,b=SC[1]
note(1,P("D1"),0.2,b-0.2,58); note(10,P("D2"),0.2,b-0.2,50); swell(1,0,5,30,95); swell(10,0,5,30,90)
note(3,P("D3"),1.0,b-1,50); note(3,P("A3"),1.0,b-1,46); swell(3,1,7,20,85)
note(0,P("A4"),5.5,b-5.5,38); note(0,P("D5"),8.5,b-8.5,40); swell(0,5.5,b,25,90)
for i,(t,n_) in enumerate([(1.6,"D4"),(2.5,"A4"),(3.6,"G4"),(4.2,"A4"),(6.6,"D5"),(7.4,"C5"),(8.2,"A4"),(10.2,"F4"),(10.9,"G4"),(11.6,"A4"),(12.9,"D4")]): note(4,P(n_),t,3,58)
for t in (9.4,10.4,11.4,12.4): dombra(t,1.0,"Dm",v=44+ (t-9.4)*5,beats=1)
roll(b-1.6,b,"D2",25,72)
# ---- S2: steppe, dombra ----
prog=["Dm","Dm","Bb","F","C","Dm"]
for i,(t,L,c) in enumerate(bars(2,prog)):
    dombra(t,L,c,v=84); pad(0,t,L,c,(3,4),52); bass(t,L,c,62); pulse(t,L,52)
    if i==0: timp(t,"D2",84)
melody(6,SC[2][0]+ (SC[2][1]-SC[2][0])/6*2,(SC[2][1]-SC[2][0])/6,THEME_m,v=70)
swell(0,SC[2][0],SC[2][1],80,105)
# ---- S3: independence — rise ----
prog=["Dm","Bb","Gm","A","Dm","Bb","F","C"]
B3=bars(3,prog)
for i,(t,L,c) in enumerate(B3):
    v=56+i*5; pad(0,t,L,c,(3,4,5) if i>=4 else (3,4),v); bass(t,L,c,v+8); pad(3,t,L,c,(3,),v-14)
    if i>=2: stacc(t,L,c,v-6,div=8,o=3)
    if i>=4: pad(8,t,L,c,(3,),v-4); pulse(t,L,v-4); drum(t,49,70) if i==4 else None; timp(t,CH[c][0]+"2",96)
roll(B3[3][0],B3[4][0],"A1",30,112)
melody(2,B3[4][0],B3[4][1],up(THEME_m,0),v=98); melody(8,B3[4][0],B3[4][1],up(THEME_m,0),v=74)
swell(0,SC[3][0],B3[4][0],70,127)
# ---- S4: building the country ----
prog=["Bb","F","C","Dm","Bb","F","C","A"]
for i,(t,L,c) in enumerate(bars(4,prog)):
    stacc(t,L,c,62,div=8,o=4); pad(0,t,L,c,(3,),46); bass(t,L,c,60); harp(t,L,c,50,div=4)
    if i%2==0: dombra(t,L,c,v=58,beats=2)
    if i>=4: pulse(t,L,48,beats=2)
melody(10,bars(4,prog)[4][0],bars(4,prog)[4][1],[("D4",2),("F4",2),("C4",2),("A3",2),("E4",2),("G4",2),("A4",3),("E4",1)],v=70)
# ---- S5: Astana — uplift ----
prog=["F","C","Dm","Bb","F","C","Bb","C"]
B5=bars(5,prog)
for i,(t,L,c) in enumerate(B5):
    pad(0,t,L,c,(3,4),66); bass(t,L,c,70); stacc(t,L,c,60,div=8,o=5); pulse(t,L,56); pad(3,t,L,c,(4,),44)
    if i in (0,4): drum(t,49,62); timp(t,"F2",86)
melody(2,B5[0][0],B5[0][1],[("C4",1.5),("F4",.5),("A4",1),("C5",1),("C5",1.5),("D5",.5),("C5",1),("G4",1),("A4",1.5),("G4",.5),("F4",1),("D4",1),("F4",2),("D4",2)],v=88)
melody(2,B5[4][0],B5[4][1],[("C4",1.5),("F4",.5),("A4",1),("C5",1),("E5",1.5),("D5",.5),("C5",1),("G4",1),("D5",2),("Bb4",2),("C5",3),(None,1)],v=92)
# ---- S6: people — warm ----
prog=["Dm","Bb","F","C","Dm","Bb","C","C"]
B6=bars(6,prog)
for i,(t,L,c) in enumerate(B6):
    pad(0,t,L,c,(3,4),54); bass(t,L,c,56); harp(t,L,c,60); pad(3,t,L,c,(3,),40)
melody(6,B6[0][0],B6[0][1],THEME_m+[("D5",2),("C5",2),("A4",2),("G4",2),("A4",2),("G4",2),("E4",3),(None,1)],v=76)
melody(10,B6[4][0],B6[4][1],[("F3",2),("A3",2),("Bb3",2),("D4",2),("E4",2),("G4",2),("G4",4)],v=66)
# ---- S7: modern — drive ----
prog=["Bb","C","Dm","F","Bb","C","Dm","A"]
B7=bars(7,prog)
for i,(t,L,c) in enumerate(B7):
    stacc(t,L,c,70,div=8,o=4); stacc(t,L,c,52,div=16,o=5); pad(0,t,L,c,(3,),54); bass(t,L,c,70); pulse(t,L,66); pad(8,t,L,c,(3,),48 if i>=4 else 1)
    if i%4==0: drum(t,49,60); timp(t,CH[c][0]+"2",90)
    dombra(t,L,c,v=60,beats=2)
melody(2,B7[4][0],B7[4][1],[("D4",2),("F4",2),("G4",2),("E4",2),("A4",2),("F4",2),("E4",3),("A4",1)],v=90)
roll(B7[7][0]+B7[7][1]*0.4,B7[7][0]+B7[7][1],"A1",30,92)
# ---- S8: next generation — tender then rising (D major arrives) ----
prog=["D","G","Bm","G","D","G","A","Asus"]
B8=bars(8,prog)
for i,(t,L,c) in enumerate(B8):
    pad(0,t,L,c,(3,4),50+i*4); bass(t,L,c,54+i*3); harp(t,L,c,62)
    if i>=4: pad(3,t,L,c,(3,4),40+i*3); pulse(t,L,40+i*4,beats=2)
melody(11,B8[0][0],B8[0][1],THEME_M,v=78); melody(6,B8[4][0],B8[4][1],up(THEME_M,12)[:8]+[("A5",2),("B5",2),("A5",4)],v=74)
roll(B8[7][0],B8[7][0]+B8[7][1],"A1",28,110)
# ---- S9: climax ----
a,b=SC[9]; endm=TOTAL-0.4
n9=5; L9=(b-4.7-a+0.9)/n9  # bars until the final chord
prog=["D","G","Bm","G","A"]
for i,c in enumerate(prog):
    t=a+i*L9
    pad(0,t,L9,c,(3,4,5),82); bass(t,L9,c,86); pad(8,t,L9,c,(3,4),70); pad(3,t,L9,c,(3,4),62); pulse(t,L9,80); timp(t,CH[c][0]+"2",104); stacc(t,L9,c,62,div=16,o=5); dombra(t,L9,c,v=62)
    if i in (0,2,4): drum(t,49,82)
melody(2,a,L9,THEME_M,v=104); melody(6,a,L9,up(THEME_M,12),v=84)
melody(2,a+4*L9,L9,[("E4",2),("A4",1),("C#5",1)],v=104)
roll(a+4*L9+L9*0.5,a+5*L9,"A1",50,120)
tf=a+5*L9
pad(0,tf,endm-tf,"D",(2,3,4,5),90,over=0); pad(8,tf,endm-tf-1,"D",(3,4),80,over=0); pad(3,tf,endm-tf,"D",(3,4),70,over=0); note(1,P("D1"),tf,endm-tf,96); timp(tf,"D2",118); drum(tf,49,100); drum(tf,36,110)
note(2,P("D5"),tf,endm-tf-1,100); note(2,P("A4"),tf,endm-tf-1,92)
for k,(tt,nn) in enumerate([(tf+1.2,"D5"),(tf+1.7,"F#5"),(tf+2.2,"A5"),(tf+2.9,"D6")]): note(4,P(nn),tt,3,70)
for ch in (0,8,3,1,2): swell(ch,tf+1.5,endm,127,18)
print("final chord at",tf)
# ---- write midi (60 bpm => 1 beat = 1 s) ----
mid=mido.MidiFile(ticks_per_beat=TPB); tr=mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage("set_tempo",tempo=1000000,time=0))
for ch,p in PROG.items():
    tr.append(mido.Message("program_change",channel=ch,program=p,time=0)); tr.append(mido.Message("control_change",channel=ch,control=91,value=90,time=0)); tr.append(mido.Message("control_change",channel=ch,control=11,value=110,time=0))
tr.append(mido.Message("program_change",channel=9,program=48,time=0))
for ch,pan in ((0,54),(1,74),(10,80),(2,44),(8,84),(5,38),(4,96),(6,70),(11,60)): tr.append(mido.Message("control_change",channel=ch,control=10,value=pan,time=0))
ev.sort(key=lambda e:(e[0],0 if e[1].type!="note_on" else 1)); last=0
for t,m in ev:
    tk=int(round(t*TPB)); m.time=max(0,tk-last); last=max(last,tk); tr.append(m)
mid.save("music/score.mid")
subprocess.run(["fluidsynth","-ni","-q","-g","0.55","-r","48000","-o","synth.reverb.room-size=0.85","-o","synth.reverb.level=0.9","-o","synth.reverb.damp=0.3","-o","synth.reverb.width=1","-F","music/score_raw.wav","/usr/share/sounds/sf2/FluidR3_GM.sf2","music/score.mid"],check=True)
