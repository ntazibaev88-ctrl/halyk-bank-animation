"""Final audio mix for «АТАНЫҢ АМАНАТЫ» (48 kHz stereo, 120 s, -14 LUFS / -1 dBTP).

Layers: Kazakh voiceover (ducks the music), score edited from one cinematic track
+ synthesised Eb string drone + synthesised dombra, and scene ambiences / transitions.
"""
import os, subprocess, json, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SR = 48000
DUR = 120.0
N = int(DUR * SR)

def load(path):
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).astype(np.float64)

def db(x): return 10 ** (x / 20)

def place(bus, src, src_t, film_t, film_end, gain_db=0.0, fin=0.05, fout=0.05):
    """Copy src[src_t:] to bus[film_t:film_end] with linear fades (seconds)."""
    i0, i1 = int(film_t * SR), min(N, int(film_end * SR))
    s0 = int(src_t * SR)
    seg = src[s0:s0 + (i1 - i0)].copy()
    n = len(seg)
    if n <= 0: return
    env = np.ones(n)
    a = min(n, int(fin * SR)); b = min(n, int(fout * SR))
    if a > 0: env[:a] = np.linspace(0, 1, a) ** 1.5
    if b > 0: env[-b:] *= np.linspace(1, 0, b) ** 1.5
    bus[i0:i0 + n] += seg * env[:, None] * db(gain_db)

def automation(points):
    """Piecewise-linear gain curve in dB -> linear array over the film."""
    t = np.arange(N) / SR
    xs, ys = zip(*points)
    return db(np.interp(t, xs, ys))

def follower(x, attack=0.06, release=0.45):
    env = np.abs(x).max(1)
    # block RMS then smoothing (fast, vectorised)
    blk = 480
    m = np.sqrt(np.convolve(env ** 2, np.ones(blk) / blk, mode="same"))
    out = np.empty_like(m); s = 0.0
    a_up = np.exp(-48 / (attack * SR)); a_dn = np.exp(-48 / (release * SR))
    for i in range(0, len(m), 48):  # 1 ms steps
        v = m[i]; s = a_up * s + (1 - a_up) * v if v > s else a_dn * s + (1 - a_dn) * v
        out[i:i + 48] = s
    return out

def reverb_ir(seconds=1.6, predelay=0.012, seed=7):
    r = np.random.default_rng(seed); n = int(seconds * SR); t = np.arange(n) / SR
    ir = r.normal(0, 1, (n, 2)) * np.exp(-t / (seconds / 6.9))[:, None]
    ir[: int(predelay * SR)] = 0
    # darker tail
    k = np.exp(-np.arange(64) / 10.0); k /= k.sum()
    for c in range(2): ir[:, c] = np.convolve(ir[:, c], k, mode="same")
    return ir / np.abs(ir).sum(0).max() * 6

def convolve(x, ir):
    n = len(x) + len(ir) - 1; nf = 1 << (n - 1).bit_length()
    out = np.zeros((len(x), 2))
    for c in range(2):
        y = np.fft.irfft(np.fft.rfft(x[:, c], nf) * np.fft.rfft(ir[:, c], nf), nf)[: len(x)]
        out[:, c] = y
    return out

def main():
    vo = load("audio/vo_track.wav")[:N]
    vo = np.pad(vo, ((0, N - len(vo)), (0, 0)))
    music_src = load("media/music/mm_594.mp3")
    sfx = {k: load(f"audio/sfx/{k}.wav") for k in ["wind_soft", "wind_winter", "room_tone", "clock", "steps_snow_crowd",
                                                   "swell_2s", "swell_4s", "impact", "flag_flutter", "drone_eb", "dombra_memory"]}
    if os.path.exists("media/raw/s_windsnow.wav"):
        sfx["wind_winter"] = load("media/raw/s_windsnow.wav")

    # ---------------- SCORE ----------------
    mus = np.zeros((N, 2))
    place(mus, music_src, 2.0, 0.0, 12.7, 0, fin=2.5, fout=0.9)            # Sc.1: quiet opening
    place(mus, music_src, 41.0, 90.9, 107.0, -1, fin=1.4, fout=1.2)         # Sc.7: quiet material returns
    place(mus, music_src, 90.0 - 1.6, 43.2 - 1.6, 92.0, 0, fin=1.6, fout=1.6)  # Sc.4–6: bass entrance on the date
    place(mus, music_src, 106.0 + 119.0 - 0.0, 106.0, 120.0, 0, fin=0.8, fout=1.2)  # Sc.8: climax to final cadence
    drone = np.zeros((N, 2))
    place(drone, sfx["drone_eb"], 0.0, 11.8, 43.8, 0, fin=1.8, fout=1.2)     # Sc.2–3: deep atmosphere
    dom = np.zeros((N, 2))
    place(dom, sfx["dombra_memory"], 0.0, 1.2, 12.0, 0, fin=0.02, fout=1.5)
    place(dom, sfx["dombra_memory"], 0.0, 97.6, 106.6, -1, fin=0.02, fout=1.5)

    music_level = automation([
        (0, -10), (8, -9), (12, -9), (12.6, -40),
        (43.0, -40), (43.2, -5), (58, -5), (73, -4), (88, -3), (91.4, -7),
        (92.0, -11), (106.0, -10), (106.5, -6), (113.5, -4), (117.0, -1), (120, -1)])
    drone_level = automation([(0, -60), (11.8, -19), (27, -17), (35, -15), (43.8, -17), (44, -60), (120, -60)])
    dombra_level = automation([(0, -13), (12, -13), (97, -14), (107, -14)])

    # ---- level rider: drive the score to a target level, lower while the voice speaks ----
    raw = mus * music_level[:, None] + drone * drone_level[:, None]
    env = follower(vo, 0.05, 0.6)
    active = np.clip(env / (env.max() * 0.06), 0, 1)                 # 0 silence .. 1 speech
    act = np.convolve(active, np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
    t = np.arange(N) / SR
    gap_target = np.interp(t, [0, 12, 12.5, 43, 43.5, 91, 91.5, 106, 106.5, 113.5, 117, 120],
                              [-27, -27, -28, -28, -24, -24, -27, -27, -25, -22, -18, -18])
    target = gap_target - 8.0 * act                                    # ~-32..-35 under speech
    p = raw.mean(1) ** 2
    w = int(1.2 * SR)
    lvl = 10 * np.log10(np.convolve(p, np.ones(w) / w, mode="same") + 1e-12)
    gain_db = np.clip(target - lvl, -26, 18)
    g = np.convolve(gain_db, np.ones(int(0.4 * SR)) / int(0.4 * SR), mode="same")
    # never boost true silences (fades/gaps in the edit)
    g = np.where(lvl < -70, -26, g)
    np.save("build/rider.npy", np.stack([lvl[::4800], target[::4800], g[::4800], act[::4800]]).astype(np.float32))
    score = raw * db(g)[:, None] + dom * dombra_level[:, None] * db(-4 * act)[:, None]

    # ---------------- AMBIENCE / SFX ----------------
    amb = np.zeros((N, 2))
    place(amb, sfx["wind_soft"], 0.0, 0.0, 4.6, -30, fin=1.5, fout=0.8)        # steppe wind under the horses
    place(amb, sfx["room_tone"], 0.0, 3.8, 12.4, -30, fin=0.6, fout=0.4)       # quiet room
    place(amb, sfx["clock"], 0.0, 3.8, 12.4, -34, fin=0.4, fout=0.4)
    place(amb, sfx["swell_2s"], 0.0, 12.2 - 1.75, 12.2 + 0.45, -22, fin=0.1, fout=0.3)   # into the light
    place(amb, sfx["wind_winter"], 0.0, 26.6, 39.2, -33, fin=1.2, fout=0.8)    # winter wind, 1986
    place(amb, sfx["steps_snow_crowd"], 0.0, 30.8, 38.6, -30, fin=1.0, fout=1.5)
    place(amb, sfx["room_tone"], 5.0, 38.8, 43.4, -30, fin=0.5, fout=0.4)
    place(amb, sfx["clock"], 3.0, 38.8, 43.2, -33, fin=0.5, fout=0.3)
    place(amb, sfx["swell_4s"], 0.0, 43.2 - 3.0, 43.2 + 1.0, -22, fin=0.2, fout=0.4)
    place(amb, sfx["impact"], 0.0, 43.25, 47.0, -19, fin=0.0, fout=1.0)        # the date
    place(amb, sfx["swell_2s"], 0.0, 58.4 - 1.75, 58.4 + 0.4, -24, fin=0.1, fout=0.3)
    place(amb, sfx["flag_flutter"], 0.0, 58.4, 62.2, -30, fin=0.4, fout=0.4)
    place(amb, sfx["flag_flutter"], 4.0, 89.6, 91.9, -28, fin=0.3, fout=0.5)
    place(amb, sfx["room_tone"], 10.0, 91.4, 106.6, -30, fin=0.8, fout=0.6)
    place(amb, sfx["clock"], 6.0, 91.4, 106.4, -35, fin=0.8, fout=0.5)
    place(amb, sfx["wind_soft"], 10.0, 106.2, 120.0, -34, fin=1.2, fout=1.0)  # outdoor dawn wind
    place(amb, sfx["flag_flutter"], 8.0, 106.4, 120.0, -32, fin=1.0, fout=1.0)
    place(amb, sfx["impact"], 0.0, 113.8, 117.6, -22, fin=0.0, fout=1.2)      # title lands

    # ---------------- VOICE ----------------
    ir = reverb_ir(1.1)
    vo_wet = convolve(vo, ir)
    voice = vo + vo_wet * db(-17)

    mix = voice * db(0) + score + amb
    np.save("build/stems.npy", np.stack([voice.mean(1), score.mean(1), amb.mean(1)]).astype(np.float32))
    # gentle bus glue + safety
    mix = np.tanh(mix * 0.9) / 0.9
    tmp = "build/mix_pre.wav"
    write(tmp, mix)
    # two-pass loudness normalisation to -14 LUFS, -1 dBTP
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
          f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample=48000")
    os.makedirs("assets/audio", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", af, "-t", str(DUR), "-c:a", "pcm_s24le", "assets/audio/final_mix.wav"], check=True)
    # deliverable: voiceover track aligned to the film
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/vo_track.wav", "-af", "loudnorm=I=-16:TP=-1.0", "-ar", "48000",
                    "-c:a", "pcm_s24le", "../deliverables/KAZAKH_VOICEOVER.wav"], check=True)
    print("measured input", j["input_i"], "LUFS; written assets/audio/final_mix.wav")

def write(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

if __name__ == "__main__":
    main()
