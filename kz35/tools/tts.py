import sys, asyncio, json, certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts
async def main(text, out, rate="+0%", pitch="+0Hz"):
    c = edge_tts.Communicate(text, "kk-KZ-DauletNeural", rate=rate, pitch=pitch, boundary="WordBoundary")
    marks=[]
    with open(out,"wb") as f:
        async for ch in c.stream():
            if ch["type"]=="audio": f.write(ch["data"])
            elif ch["type"]=="WordBoundary": marks.append({"t":ch["offset"]/1e7,"d":ch["duration"]/1e7,"w":ch["text"]})
    json.dump(marks, open(out+".json","w"), ensure_ascii=False, indent=0)
a=sys.argv
asyncio.run(main(a[1],a[2],*(a[3:])))
