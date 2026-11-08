# REVIEW — «Қазақстан — 35 жыл» (3D version)

## What changed
- The 2D illustrated scenes were replaced by a **3D film** built in Three.js (`world3d/`): 24 shots, physically based materials on hero objects, HDR image lighting, procedural sky with clouds, atmospheric fog, water with real reflections, depth of field, bloom, god rays, lens ghosts, per-era colour grade, film grain.
- The flag is a **verlet cloth simulation** (deterministic, cached per frame) in every flag shot.
- Mountains in the 1991 opening use **real elevation data** of the Zailiysky Alatau near Almaty.
- Titles, captions, voice and music are composited in HyperFrames over the baked 3D plate. Voice, captions, music and timing are unchanged from the previous version.

## Honest limits
- **Not Unreal Engine 5 and not photoreal.** This sandbox has no GPU and no Unreal/Blender; everything is rendered in software WebGL on 4 CPU cores (~0.5 s per frame at 864×1536, upscaled to 1080×1920). The look is "cinematic real-time 3D": good light, haze, depth of field and grade, but simplified geometry. True photoreal (path-traced, high-poly assets, photogrammetry) needs a GPU workstation and an artist team, or Unreal/Blender renders — `world3d/` can serve as the animatic/layout for that.
- City buildings are procedural boxes with setbacks and window textures; landmarks (Baiterek, Khan Shatyr, Ak Orda, pyramid, mosque, Nur Alem) are recognisable stylised models, not survey-accurate.
- People are simple backlit silhouettes (no faces, no animation rigs).
- The State Emblem in 3D is a stylised rendition; foreign flags at the UN/EXPO are deliberately plain coloured banners.
- The 3D plate (`assets/plate/plate.mp4`, ~600 MB intermediate) is not in git; rebuild it with `world3d/README.md`.

## Measured vs looked at
- `hyperframes check`: passes; only "dense track" lint warnings (kept on purpose: one captions composition and one title composition per chapter).
- Contact sheets of every shot were reviewed at preview and full scale; a red cast on silhouettes in the sunrise shots (god-ray spill) was found and fixed.
- Sound was measured, not heard (unchanged mix: music 7–10 dB under the voice).

## Weakest shots / next steps
- Campus and robot-factory shots (≈70–73 s) are the simplest; with a GPU they would get detailed interiors.
- Wider city aerials show the simplified building geometry; more facade detail, rooftop equipment and traffic would help.
- With a GPU: render at `scale=1`, raise shadow resolution, add SSAO and higher-quality depth of field.
