import asyncio, json, ssl, sys, os, aiohttp, certifi
certifi.where = lambda: '/root/.ccr/ca-bundle.crt'
import edge_tts, edge_tts.communicate as c
c.certifi = certifi
OUT = sys.argv[1]; RATE = sys.argv[2] if len(sys.argv) > 2 else '-6%'; PITCH = sys.argv[3] if len(sys.argv) > 3 else '-4Hz'
os.makedirs(OUT, exist_ok=True)
async def one(seg):
    for attempt in range(5):
        try:
            com = edge_tts.Communicate(seg['speak'], 'kk-KZ-DauletNeural', rate=RATE, pitch=PITCH, boundary='WordBoundary')
            words = []; audio = bytearray()
            async for ch in com.stream():
                if ch['type'] == 'audio': audio += ch['data']
                elif ch['type'] == 'WordBoundary':
                    words.append({'w': ch['text'], 'start': ch['offset']/1e7, 'end': (ch['offset']+ch['duration'])/1e7})
            open(f"{OUT}/{seg['id']}.mp3", 'wb').write(audio)
            json.dump(words, open(f"{OUT}/{seg['id']}.words.json", 'w'), ensure_ascii=False)
            return
        except Exception as e:
            print('retry', seg['id'], e); await asyncio.sleep(2)
async def main():
    segs = json.load(open('narration.json'))
    for s in segs: await one(s)
asyncio.run(main())
