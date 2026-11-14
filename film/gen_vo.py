import certifi, sys, asyncio, json, os, subprocess
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
RATE=sys.argv[1] if len(sys.argv)>1 else "-6%"
async def one(text,out):
    for attempt in range(4):
        try:
            c=edge_tts.Communicate(text,"kk-KZ-DauletNeural",rate=RATE,boundary="WordBoundary",proxy=os.environ["HTTPS_PROXY"])
            words=[]
            with open(out,"wb") as f:
                async for ch in c.stream():
                    if ch["type"]=="audio": f.write(ch["data"])
                    elif ch["type"]=="WordBoundary": words.append([ch["offset"]/1e7,ch["duration"]/1e7,ch["text"]])
            return words
        except Exception as e:
            print("retry",e); await asyncio.sleep(3)
    raise SystemExit("tts failed")
async def main():
    sc=json.load(open("script.json")); res=[]
    for s in sc:
        for i,l in enumerate(s["lines"]):
            out=f'vo/s{s["scene"]}_{i}.mp3'
            w=await one(l,out)
            d=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",out]))
            res.append(dict(scene=s["scene"],i=i,text=l,file=out,dur=d,words=w)); print(s["scene"],i,round(d,2),l)
    json.dump(res,open("vo/lines.json","w"),ensure_ascii=False,indent=1)
    print("TOTAL",sum(r["dur"] for r in res))
asyncio.run(main())
