"""Cut, reframe (9:16) and normalise every shot listed in shots.json into public/clips/.

Usage: python3 prep.py [RAW_DIR]
Each video shot gets exactly the frames it needs (+ transition overlap), scaled to cover
1080x1920 around a horizontal focus point (fx), optional slow motion, at 30 fps.
"""
import json, os, subprocess, sys

RAW = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('RAW_DIR', 'raw')
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'clips')
os.makedirs(OUT, exist_ok=True)
spec = json.load(open(os.path.join(os.path.dirname(__file__), 'shots.json')))
total = json.load(open(os.path.join(os.path.dirname(__file__), 'timeline.json')))['total']
shots = spec['shots']

for i, s in enumerate(shots):
    nxt = shots[i + 1] if i + 1 < len(shots) else None
    end = (nxt['start'] + nxt.get('xf', 0.5)) if nxt else total
    s['dur'] = round(end - s['start'] + 0.25, 3)
    if not s.get('src'):
        continue
    name = s['id'] + '.mp4'
    dst = os.path.join(OUT, name)
    s['clip'] = name
    speed = s.get('speed', 1.0)
    src_dur = s['dur'] * speed
    probe = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                                       '-of', 'json', os.path.join(RAW, s['src'])], capture_output=True, text=True).stdout)['streams'][0]
    sw, sh = probe['width'], probe['height']
    fx = s.get('fx', 0.5); fy = s.get('fy', 0.5); zoom = s.get('zoom', 1.0)
    mode = s.get('mode', 'fill')
    if mode == 'frame':
        # keep full frame for archival treatment, 1080 wide
        vf = f"scale=1080:-2:flags=lanczos"
    else:
        # cover 1080x1920 with optional extra zoom, crop around focus
        scale = max(1080 / sw, 1920 / sh) * zoom
        W = int(round(sw * scale / 2) * 2); H = int(round(sh * scale / 2) * 2)
        cx = int(min(max(fx * W - 540, 0), W - 1080)); cy = int(min(max(fy * H - 960, 0), H - 1920))
        vf = f"scale={W}:{H}:flags=lanczos,crop=1080:1920:{cx}:{cy}"
        if scale > 1.6:
            vf += ',unsharp=5:5:0.6:5:5:0.0'
    pre = []
    if speed != 1.0:
        pre.append(f"setpts=PTS/{speed}")
    filters = ','.join(pre + [vf, 'fps=30' if speed == 1.0 else 'minterpolate=fps=30:mi_mode=blend', 'format=yuv420p'])
    if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(os.path.join(os.path.dirname(__file__), 'shots.json')):
        print('skip', name); continue
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s.get('ss', 0)), '-t', str(src_dur + 0.2), '-i', os.path.join(RAW, s['src']),
           '-vf', filters, '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '15', '-g', '15', '-t', str(s['dur']), dst]
    subprocess.run(cmd, check=True)
    print('ok', name, s['dur'], 's')

json.dump(spec, open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'shots.json'), 'w'), ensure_ascii=False, indent=1)
