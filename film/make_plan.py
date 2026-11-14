# timeline + shots.json -> build/shots_resolved.json, remotion/public/plan.json, build/timeline.md, build/subtitles.srt
import json, re
T=json.load(open("build/timeline.json")); S=json.load(open("shots.json")); SCRIPT=json.load(open("script.json"))
TOTAL=T["total"]; SC={s["scene"]:s for s in T["scenes"]}; LN={(l["scene"],l["i"]):l for l in T["lines"]}
def anchor(a):
    m=re.match(r"^(S|L|E|W)(\d+)(?:\.(\d+))?(?:\.(\d+))?([+-][\d.]+)?$",a); k,sc,i,wi,off=m.groups(); off=float(off or 0)
    if k=="W": return LN[(int(sc),int(i))]["wt"][int(wi)][0]-0.12+off
    if k=="S": return SC[int(sc)]["start"]+off
    if k=="L": return LN[(int(sc),int(i))]["start"]-0.18+off
    if k=="E": return LN[(int(sc),int(i))]["end"]+off
shots=S["shots"]
for s in shots: s["start"]=round(max(0,anchor(s["at"])),3)
for a,b in zip(shots,shots[1:]+[None]): a["end"]=b["start"] if b else TOTAL; a["dur"]=round(a["end"]-a["start"],3)
json.dump(shots,open("build/shots_resolved.json","w"),ensure_ascii=False,indent=1)
GOLD=["отыз бес","тәуелсіз","азат","қазақстан","ұлы дала","арман","1991","16 желтоқсан","ел","астана","халқы","бірлі","болашақ","ұрпақ","жастар","мәңгі","теңге","валюта","тарих","аманат","жаңа","еңбег","мемлекет"]
def is_gold(w,ctx):
    x=re.sub(r"[^\w]","",w.lower())
    for g in GOLD:
        if " " in g:
            if g in ctx.lower() and x in g.split(): return True
        elif g=="ел":
            if x in ("ел","елдің","еліміз","елдік"): return True
        elif x.startswith(g): return True
    return False
DISPLAY={(3,0):"1991 жылдың 16 желтоқсаны."}
subs=[]
for l in T["lines"]:
    key=(l["scene"],l["i"]); toks=l["text"].split(); wt=l["wt"]
    if key in DISPLAY:
        chunks=[(DISPLAY[key].split(),l["start"],l["end"])]
    else:
        # map tokens -> timings
        tm=[]; j=0
        for tk in toks:
            if re.search(r"\w",tk) and j<len(wt): tm.append(wt[j]); j+=1
            else: tm.append(None)
        def split(lo,hi):
            txt=" ".join(toks[lo:hi])
            if len(txt)<=38 or hi-lo<2: return [(lo,hi)]
            mid=len(txt)/2; best=None
            for pref in (True,False):
                for k in range(lo+1,hi):
                    left=" ".join(toks[lo:k]); right=" ".join(toks[k:hi])
                    if toks[k]=="—": continue            # dash stays with the left part
                    punct=toks[k-1][-1] in ",;" or toks[k-1]=="—"
                    if pref and not punct: continue
                    if len(left)<9 or len(right)<9: continue
                    sc=abs(len(left)-mid)
                    if best is None or sc<best[0]: best=(sc,k)
                if best and (pref and best[0]<=len(txt)*0.3 or not pref): break
                if pref: best=None
            if not best: return [(lo,hi)]
            return split(lo,best[1])+split(best[1],hi)
        chunks=[]
        for lo,hi in split(0,len(toks)):
            st=next((tm[k][0] for k in range(lo,hi) if tm[k]),None)
            chunks.append((toks[lo:hi],st,None))
    for n,(c,s,e) in enumerate(chunks):
        st=(s if s is not None else l["start"])-0.04
        en=(chunks[n+1][1]-0.04) if n+1<len(chunks) and chunks[n+1][1] else l["end"]+0.30
        txt=" ".join(c)
        if len(txt)>23:
            best=min(range(1,len(c)),key=lambda q:abs(len(" ".join(c[:q]))-len(" ".join(c[q:]))))
            lines=[c[:best],c[best:]]
        else: lines=[c]
        subs.append(dict(start=round(max(st,l["start"]-0.05),3),end=round(en,3),lines=[[dict(t=w,gold=is_gold(w,txt)) for w in ln] for ln in lines],text=[" ".join(ln) for ln in lines]))
for a,b in zip(subs,subs[1:]): a["end"]=min(a["end"],b["start"])
titles=[]
for sc in SCRIPT:
    cfg=S["titles"].get(str(sc["scene"]))
    if not cfg: continue
    st=anchor(cfg["at"]); titles.append(dict(start=round(st,3),end=round(st+cfg.get("dur",3.8),3),lines=sc["title"],scene=sc["scene"]))
plan=dict(total=TOTAL,final=dict(start=0),subs=subs,titles=titles,
  shots=[dict(id=s["id"],start=s["start"],end=s["end"],kind=s["kind"],file=f'shots/{s["id"]}.mp4' if s["kind"]=="video" else None,graphic=s.get("graphic"),label=s.get("label"),labelY=s.get("label_y"),drift=s.get("drift"),fade=s.get("fade")) for s in shots])
json.dump(plan,open("remotion/public/plan.json","w"),ensure_ascii=False)
def tc(t): return f"{int(t//60):02d}:{t%60:06.3f}"
def srt(t): h=int(t//3600); m=int(t%3600//60); s=t%60; return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s%1)*1000))%1000:03d}"
open("build/subtitles.srt","w").write("\n".join(f"{i+1}\n{srt(s['start'])} --> {srt(s['end'])}\n"+"\n".join(s["text"])+"\n" for i,s in enumerate(subs)))
md=["# Production timeline\n","| # | Start | End | Dur | Shot / file | Visual subject | Narration heard | Source |","|---|---|---|---|---|---|---|---|"]
for i,s in enumerate(shots):
    nar=" ".join(l["text"] for l in T["lines"] if l["start"]<s["end"]-0.3 and l["end"]>s["start"]+0.3)
    md.append(f'| {i+1} | {tc(s["start"])} | {tc(s["end"])} | {s["dur"]:.1f}s | `{s["id"]}` ({s["kind"]}) | {s.get("subject","")} | {nar} | {s.get("credit","")} |')
md+=["\n## Narration lines\n","| Scene | Start | End | Text |","|---|---|---|---|"]+[f'| {l["scene"]} | {tc(l["start"])} | {tc(l["end"])} | {l["text"]} |' for l in T["lines"]]
md+=["\n## Subtitles\n","| Start | End | Text |","|---|---|---|"]+[f'| {tc(s["start"])} | {tc(s["end"])} | {" / ".join(s["text"])} |' for s in subs]
open("build/timeline.md","w").write("\n".join(md))
print(len(shots),"shots",len(subs),"subs"); [print(f'{s["start"]:7.2f} {s["dur"]:5.2f} {s["id"]}') for s in shots]
