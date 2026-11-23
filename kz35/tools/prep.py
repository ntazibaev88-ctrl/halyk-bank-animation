#!/usr/bin/env python3
"""Prepare graded, reframed 2160x3840 shot media for every EDL entry.

video shots -> hf/media/shots/<id>.mp4   (exact length = dur + handle, 30 fps, silent)
image shots -> hf/media/shots/<id>.jpg   (2376x4224 = 10% headroom for camera moves)
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
W, H = 2160, 3840
IW, IH = 2376, 4224  # image canvas with headroom

GRADES = {
    'doc': "eq=contrast=1.05:saturation=1.06:gamma=0.99,colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.02,"
           "curves=all='0/0.015 0.25/0.225 0.5/0.5 0.75/0.785 1/0.985'",
    'warm': "eq=contrast=1.06:saturation=1.10,colorbalance=rm=0.04:gm=0.01:bm=-0.04:rh=0.05:bh=-0.04,"
            "curves=all='0/0.02 0.25/0.23 0.5/0.51 0.75/0.79 1/0.98'",
    'cold': "eq=contrast=1.10:saturation=0.55:brightness=-0.03,colorbalance=rs=-0.03:bs=0.06:bm=0.04:rh=-0.02,"
            "curves=all='0/0.03 0.25/0.20 0.5/0.46 0.75/0.74 1/0.95'",
    'archival': "hue=s=0.40,colorbalance=rm=0.05:gm=0.02:bm=-0.05:rh=0.04:bh=-0.04,eq=contrast=1.10:gamma=0.97,"
                "curves=all='0/0.04 0.5/0.5 1/0.93'",
    'night': "eq=contrast=1.08:saturation=1.08,colorbalance=bs=0.04:bm=0.02:rh=0.05:bh=-0.03",
    'flag': "eq=contrast=1.04:saturation=1.0,curves=all='0/0.02 0.5/0.5 1/0.98'",
    'none': "null",
}


def probe(src):
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                   'stream=width,height', '-of', 'csv=p=0', src]).decode().strip().split('\n')[0]
    w, h = [int(x) for x in out.split(',')[:2]]
    return w, h


def region(w, h, aspect, zoom, cx, cy):
    """Largest crop of given aspect (w/h), shrunk by zoom, positioned by cx/cy (0..1)."""
    if w / h > aspect:
        rh = h / zoom; rw = rh * aspect
    else:
        rw = w / zoom; rh = rw / aspect
    rw, rh = int(rw) // 2 * 2, int(rh) // 2 * 2
    x = int((w - rw) * cx) // 2 * 2
    y = int((h - rh) * cy) // 2 * 2
    return rw, rh, x, y


def build_filter(s, w, h, outw, outh, is_video):
    g = GRADES[s.get('grade', 'doc')]
    pre = 'hqdn3d=2:1.5:3:3,' if (is_video and max(w, h) < 1300) else ''
    sharpen = 'unsharp=5:5:0.45:5:5:0.0' if max(w, h) < 2600 else 'null'
    if s.get('mode', 'cover') == 'cover':
        rw, rh, x, y = region(w, h, outw / outh, s.get('zoom', 1.0), s.get('cx', 0.5), s.get('cy', 0.5))
        return f"{pre}crop={rw}:{rh}:{x}:{y},scale={outw}:{outh}:flags=lanczos,{sharpen},{g},setsar=1"
    # framed: sharp foreground band + blurred (or dark) full-frame background
    k = outw / W
    fgw = int(s.get('fgw', W) * k) // 2 * 2
    fgh = int(s.get('fgh', 1400) * k) // 2 * 2
    rw, rh, x, y = region(w, h, fgw / fgh, s.get('zoom', 1.0), s.get('cx', 0.5), s.get('cy', 0.5))
    bw, bh, bx, by = region(w, h, outw / outh, 1.0, 0.5, 0.5)
    fy = int((s.get('fgy', 1640) - s.get('fgh', 1400) / 2) * k)
    fx = (outw - fgw) // 2
    if s.get('bg') == 'dark':
        bg = (f"[a]crop={bw}:{bh}:{bx}:{by},scale={outw}:{outh},geq=lum='18+22*(1-hypot(X/W-0.5,Y/H-0.45)*1.6)':cb=134:cr=124[bg];")
    else:
        bg = (f"[a]crop={bw}:{bh}:{bx}:{by},scale={outw // 8}:{outh // 8},boxblur=12:2,scale={outw}:{outh}:flags=bicubic,"
              f"eq=brightness=-0.16:saturation=0.75,{g}[bg];")
    edge = ("drawbox=x=0:y=0:w=iw:h=3:color=white@0.35:t=fill,drawbox=x=0:y=ih-3:w=iw:h=3:color=white@0.35:t=fill"
            if fgw == outw else "null")
    mask = ''
    if s.get('circle'):
        mask = f",format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*clip((0.487*W-hypot(X-W/2,Y-H/2))/2.5,0,1)'"
    return (f"split=2[a][b];{bg}"
            f"[b]{pre}crop={rw}:{rh}:{x}:{y},scale={fgw}:{fgh}:flags=lanczos,{sharpen},{g},{edge}{mask}[fg];"
            f"[bg][fg]overlay={fx}:{fy},setsar=1")


def prep(s):
    os.makedirs(P('hf/media/shots'), exist_ok=True)
    src = P(s['src'])
    is_video = s['type'] == 'video'
    w, h = probe(src)
    if is_video:
        out = P('hf/media/shots', s['id'] + '.mp4')
        dur = s['end'] - s['start'] + s.get('tdur', 0.5) + 0.1
        speed = s.get('speed', 1.0)
        vf = build_filter(s, w, h, W, H, True)
        grain = ",noise=alls=5:allf=t" if s.get('grade') == 'archival' else ''
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(s.get('in', 0)), '-t', f'{dur * speed + 0.5:.3f}', '-i', src,
               '-filter_complex', f"[0:v]setpts=(PTS-STARTPTS)/{speed},fps=30,{vf}{grain},format=yuv420p[v]",
               '-map', '[v]', '-t', f'{dur:.3f}', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '15',
               '-g', '30', '-movflags', '+faststart', out]
    else:
        out = P('hf/media/shots', s['id'] + '.jpg')
        vf = build_filter(s, w, h, IW, IH, False)
        cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', f"[0:v]{vf}[v]", '-map', '[v]',
               '-frames:v', '1', '-q:v', '2', out]
    if os.path.exists(out) and os.path.getmtime(out) > max(os.path.getmtime(src), os.path.getmtime(P('edl.json'))) \
            and '--force' not in sys.argv:
        return s['id'], 'cached'
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        return s['id'], 'ERROR ' + r.stderr[-800:]
    return s['id'], 'ok'


if __name__ == '__main__':
    edl = json.load(open(P('edl.json')))
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    shots = [s for s in edl['shots'] if not only or s['id'] in only]
    with ThreadPoolExecutor(2) as ex:
        for sid, res in ex.map(prep, shots):
            print(sid, res, flush=True)
