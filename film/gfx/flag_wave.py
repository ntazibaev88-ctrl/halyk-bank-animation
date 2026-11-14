# Motion graphic: the national flag (public-domain artwork) animated as waving cloth. Not footage.
import numpy as np, cv2, subprocess, sys
src=cv2.imread(sys.argv[1]); out=sys.argv[2]; dur=float(sys.argv[3]); zoom=float(sys.argv[4]); cx=float(sys.argv[5]); cy=float(sys.argv[6])
W,H,FPS=1080,1920,30
fh=int(H*zoom); fw=fh*2
flag=cv2.resize(src,(fw,fh),interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
ys,xs=np.mgrid[0:H,0:W].astype(np.float32)
p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","libx264","-crf","14","-preset","medium","-pix_fmt","yuv420p",out],stdin=subprocess.PIPE)
x0=fw*cx-W/2; y0=fh*cy-H/2
for f in range(int(dur*FPS)):
    t=f/FPS
    gx=xs+x0+ t*14  # slow drift
    u=gx/fw
    ph1=2*np.pi*(gx/620 - t*0.55)+ys/900; ph2=2*np.pi*(gx/270 - t*0.9)+ys/400+1.3; ph3=2*np.pi*((gx+ys*0.6)/1100 - t*0.3)
    h=np.sin(ph1)*1.0+np.sin(ph2)*0.35+np.sin(ph3)*0.7
    dh=np.cos(ph1)*1.0+np.cos(ph2)*0.35*2.3+np.cos(ph3)*0.4
    mx=(gx+h*16).astype(np.float32); my=(ys+y0+h*22+np.sin(ph3)*10).astype(np.float32)
    img=cv2.remap(flag,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_REPLICATE)
    shade=1.0+0.20*dh/2.2
    spec=np.clip(dh/2.2-0.55,0,1)**2*38
    vig=1-0.35*(((xs-W/2)/W)**2+((ys-H/2)/H)**2)*2
    img=img*(shade*vig)[...,None]+spec[...,None]
    p.stdin.write(np.clip(img,0,255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()
