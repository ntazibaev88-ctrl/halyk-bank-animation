import subprocess,sys,os,concurrent.futures as cf
OUT="/home/user/halyk-bank-animation/jensen-huang-documentary/public/media"
os.makedirs(OUT,exist_ok=True)
# name, raw, start, dur, crop-center-x (0..1)
J=[("modi_a","modi",3.4,6.0,0.555),("modi_b","modi",21.4,6.0,0.55),
 ("cables","dc_aisle",5.5,7,0.5),("hall","dc_fiber",6.0,7,0.72),("racks","dd_racks",4.0,6,0.55),
 ("die_a","die_a",9.0,7,0.78),("die_b","die_b",0.0,8,0.45),("die_c","die_b",8.0,8,0.5),
 ("crt_pc","crt_a",5.0,6,0.55),("crt_screen","crt_b",1.0,6,0.42),("crt_grid","crt_grid",0.5,5,0.45),
 ("diner_st","diner_st",2.0,10,0.72),("mobo","gb_mobo",1.0,6,0.5),("server","gb_srv",5.0,6,0.5),
 ("hgx","nvbooth",17.0,6,0.5),("hgx_hand","nvbooth",36.0,6,0.62),("board","qct_board",0.5,6,0.5),
 ("superchip","qct_gh",5.0,7,0.45),("dimm","qct_srv",0.5,6,0.5),("robot","robot",0.0,8,0.33),
 ("rtx_a","rtx_a",0.0,6,0.45),("rtx_b","rtx_b",0.0,5,0.55),("rtx_end","rtx_b",5.0,5,0.5),("rtx_c","rtx_c",0.0,6,0.5)]
def run(j):
    n,r,s,d,cx=j; out=f"{OUT}/{n}.mp4"
    src=f"raw/{r}.mp4"
    vf=f"crop=ih*9/16:ih:max(0\\,min(iw-ih*9/16\\,iw*{cx}-ih*9/32)):0,scale=1080:1920:flags=lanczos,fps=30,unsharp=5:5:0.4"
    p=subprocess.run(["ffmpeg","-v","error","-y","-ss",str(s),"-i",src,"-t",str(d),"-vf",vf,"-an","-c:v","libx264","-preset","medium","-crf","19","-pix_fmt","yuv420p",out],capture_output=True,text=True)
    return n,p.returncode,p.stderr[-200:]
todo=[j for j in J if os.path.exists(f"raw/{j[1]}.mp4") and (len(sys.argv)<2 or j[0] in sys.argv[1:])]
with cf.ThreadPoolExecutor(2) as ex:
    for r in ex.map(run,todo): print(*r,flush=True)
