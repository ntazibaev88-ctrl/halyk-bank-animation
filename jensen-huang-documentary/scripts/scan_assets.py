"""Writes src/assets.generated.json: which optional archive photos are present in public/media."""
import json, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
names = ["tainan_1960s", "taipei_night_1960s", "dennys_1970s", "dennys_oregon", "diner_doyles", "diner_salem", "gf256_die_a"]
have = {n: os.path.exists(os.path.join(root, "public", "media", n + ".jpg")) for n in names}
json.dump(have, open(os.path.join(root, "src", "assets.generated.json"), "w"), indent=1)
print(have)
