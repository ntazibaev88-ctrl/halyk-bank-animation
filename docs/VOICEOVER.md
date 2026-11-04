# Russian voice-over script (deep, confident male narrator)

Direction: low, warm, unhurried baritone; ~135–150 wpm; slight smile on S1 and S7; short pause at full stops; "Halyk" read as «Халык», "Halyk Bank" as «Халык Банк». Record dry, then drop on a dedicated track over `…no-vo.mp4` (music is already ducked by ~6 dB in the guide mix; apply the same sidechain to your narrator mix).

| # | Window (s) | Text |
|---|---|---|
| 1 | 0.6 – 6.2 | Каждый день миллионы людей совершают выбор, который приближает их к новым возможностям. |
| 2 | 7.6 – 14.6 | История Halyk Bank началась в далёком 1923 году. С тех пор банк прошёл большой путь вместе с Казахстаном. |
| 3 | 15.6 – 22.6 | От первых сберегательных касс до современных цифровых решений — время меняет технологии, но потребность людей в удобстве остаётся. |
| 4 | 23.7 – 32.4 | Сегодня цифровые сервисы Halyk помогают оплачивать услуги, переводить деньги и пользоваться банковскими возможностями онлайн. |
| 5 | 33.6 – 42.4 | За каждой финансовой операцией стоит человек. Его планы, мечты, работа и стремление двигаться вперёд. |
| 6 | 43.7 – 52.4 | Развивая технологии и финансовую экосистему, Halyk продолжает быть частью повседневной жизни Казахстана. |
| 7 | 54.2 – 59.2 | Halyk Bank. История, которая продолжается вместе с людьми. |

Sync hooks (picture events the VO can land on): S1 phone lights 2.4 s · S2 calendar flip 11.4 s · S3 smartphone arrives 22 s · S4 "pay" tap 30.1 s · S5 story cut-ins 33.2 / 36.5 / 39.8 s · S6 words on screen 43.3 / 45.6 / 47.9 s · S7 wordmark 56.9 s.

Generated guide track: `audio/make_audio.py` renders `vo_guide.wav` (espeak-ng, synthetic) and `vo_timing.json` with the measured start/end of each line; every line ends inside its window.
