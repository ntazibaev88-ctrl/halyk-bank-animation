import asyncio, json, sys, ssl, edge_tts, edge_tts.communicate as _c
_c._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
lines=json.load(open("scripts_lines.json"))
cfg={"grandfather":dict(voice="kk-KZ-DauletNeural",rate=sys.argv[1] if len(sys.argv)>1 else "-14%",pitch=sys.argv[2] if len(sys.argv)>2 else "-6Hz"),
     "grandson":dict(voice="kk-KZ-AigulNeural",rate="-6%",pitch="+22Hz")}
async def one(l):
    c=cfg[l["who"]]
    com=edge_tts.Communicate(l["text"],c["voice"],rate=c["rate"],pitch=c["pitch"],boundary="WordBoundary")
    audio=bytearray(); words=[]
    async for ch in com.stream():
        if ch["type"]=="audio": audio+=ch["data"]
        elif ch["type"]=="WordBoundary":
            words.append({"t":ch["offset"]/1e7,"d":ch["duration"]/1e7,"w":ch["text"]})
    open(f"audio/vo/{l['id']}.mp3","wb").write(audio)
    json.dump(words,open(f"audio/vo/{l['id']}.words.json","w"),ensure_ascii=False)
async def main():
    for l in lines: await one(l)
asyncio.run(main())
