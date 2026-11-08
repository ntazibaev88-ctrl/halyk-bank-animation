# Footage slots

Drop one real Almaty clip per slot into this folder, named by slot number
(`01.mp4` … `17.mp4`; `.mov`, `.webm` and `.m4v` also work), then run:

```bash
npm run build   # picks up every clip found here
npm run render  # renders and loudness-normalises renders/almaty-kk.mp4
```

Any slot without a clip keeps its animated 2D stand-in, so you can add clips a few at a time.

**Tips**
- Landscape (16:9) clips are fine: they are cropped to 9:16 around the centre. To keep a
  different part of the frame, change that slot's `focus` in `../data/shots.json`
  (CSS `object-position`, e.g. `"30% 50%"` keeps more of the left side).
- A clip should be at least as long as its slot. To start later in the clip, set `in`
  (seconds) for that slot in `../data/shots.json`.
- Clips are played muted (the film has its own voice, music and ambience) and get a gentle
  grade (`grade` in `shots.json`, a HyperFrames colour-grading preset) plus a slow push-in.
- Only use footage you have the rights to, and only footage actually shot in Almaty.

| File | Film time | Length | What to shoot / find |
|---|---|---|---|
| `01.mp4` |   0.0–  6.9 s | 6.9 s | Aerial drone: Almaty city with the mountains behind, golden hour, slow forward move |
| `02.mp4` |   6.9– 13.2 s | 6.3 s | Slow panoramic drone pan across the city toward the Trans-Ili Alatau |
| `03.mp4` |  13.2– 18.3 s | 5.1 s | Street-level tracking shot on a busy Almaty street, people walking |
| `04.mp4` |  18.3– 23.1 s | 4.8 s | Modern architecture: glass towers, slow tilt or orbit |
| `05.mp4` |  23.1– 28.2 s | 5.1 s | Cafe terrace or city park with people, warm light |
| `06.mp4` |  32.6– 38.7 s | 6.1 s | Snow-capped Trans-Ili Alatau peaks with clouds moving over them |
| `07.mp4` |  38.7– 45.6 s | 7.0 s | Drone over green fir forest on the mountain slopes |
| `08.mp4` |  45.6– 50.9 s | 5.3 s | Medeu high-mountain skating rink with skaters |
| `09.mp4` |  50.9– 56.2 s | 5.3 s | Cable car gondolas moving between Medeu and Shymbulak (top half of split screen) |
| `10.mp4` |  50.9– 61.6 s | 10.7 s | Shymbulak resort: snowy slopes, peaks, tourists (bottom half of split, then expands to full screen) |
| `11.mp4` |  61.6– 68.2 s | 6.6 s | Kok Tobe viewpoint panorama over the city, people enjoying the view |
| `12.mp4` |  68.2– 72.4 s | 4.2 s | Sunset over Almaty |
| `13.mp4` |  72.4– 76.6 s | 4.2 s | Evening city lights, traffic light trails |
| `14.mp4` |  76.6– 83.7 s | 7.0 s | Panfilov Park and the wooden Ascension Cathedral |
| `15.mp4` |  83.7– 90.7 s | 7.0 s | Young people on a pedestrian street, everyday modern city life |
| `16.mp4` |  90.7– 96.7 s | 6.0 s | Mountain silhouettes at dusk |
| `17.mp4` |  96.7–106.5 s | 9.8 s | Wide aerial of Almaty at sunset with city lights, slow pull-back |

Slots `09` and `10` play together as a split screen (`09` on top, `10` below); `10` then
expands to full screen, so it needs about 10–11 s of usable footage.
