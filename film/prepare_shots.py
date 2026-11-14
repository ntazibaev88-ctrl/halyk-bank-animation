# Conform every source clip to a graded 1080x1920 / 30 fps shot in remotion/public/shots/
import json, subprocess, sys, os
shots=json.load(open("build/shots_resolved.json"))
os.makedirs("remotion/public/shots",exist_ok=True)
GRADE="eq=contrast=1.07:saturation=1.06:gamma=0.98,curves=all='0/0 0.25/0.22 0.5/0.5 0.75/0.79 1/1',colorbalance=rs=-0.02:bs=0.03:rh=0.03:bh=-0.03"
only=sys.argv[1:]
for s in shots:
    if s.get("kind")!="video" or (only and s["id"] not in only): continue
    out=f'remotion/public/shots/{s["id"]}.mp4'
    dur=s["dur"]+0.6; sp=s.get("speed",1.0)
    pre=f"setpts={1/sp}*PTS," if sp!=1 else ""
    if s.get("mode","crop")=="crop":
        x=s.get("x",0.5); z=s.get("zoom",1.0)
        pc=(s["pre"]+",") if s.get("pre") else ""
        vf=f"{pre}{pc}scale={int(1080*z)}:{int(1920*z)}:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920:(iw-1080)*{x}:(ih-1920)*{s.get('y',0.5)},{GRADE}"
        if s.get("sharpen"): vf+=",unsharp=5:5:0.6"
        if s.get("extra"): vf+=","+s["extra"]
        fc=f"[0:v]{vf},fps=30,format=yuv420p[o]"
    else:  # framed: blurred fill + sharp inset (for low-res / archival / wide shots)
        w=s.get("inset_w",1000); cy=s.get("inset_cy",800)
        ex=(","+s["extra"]) if s.get("extra") else ""
        cropin=(s["cropin"]+",") if s.get("cropin") else ""
        fc=(f"[0:v]{pre}{cropin}split[a][b];[a]scale=-2:1920,crop=1080:1920,gblur=sigma=38,eq=brightness=-0.22:saturation=0.7[bg];"
            f"[b]scale={w}:-2:flags=lanczos,{GRADE}{ex},pad=iw+8:ih+8:4:4:color=0xF2C14E@0.9[fg];"
            f"[bg][fg]overlay=(W-w)/2:{cy}-h/2,fps=30,format=yuv420p[o]")
    cmd=["ffmpeg","-v","error","-y","-ss",str(s["ss"]),"-t",str(dur*sp+0.2),"-i",s["src"],"-filter_complex",fc,"-map","[o]","-t",str(dur),"-an","-c:v","libx264","-crf","15","-preset","medium","-g","15",out]
    r=subprocess.run(cmd,capture_output=True,text=True)
    print(s["id"],"ok" if r.returncode==0 else r.stderr[-400:])
