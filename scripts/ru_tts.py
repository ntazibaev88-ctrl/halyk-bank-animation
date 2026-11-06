"""Russian narration engine: espeak-ng IPA phonemes (via ctypes) -> Piper VITS ONNX voice.

Same pipeline Piper uses, but exposed so stress can be corrected per word
(STRESS_FIX maps a word to its corrected IPA) before synthesis.
"""
import ctypes, json, re, numpy as np, onnxruntime as ort
import espeakng_loader

_lib = ctypes.cdll.LoadLibrary(espeakng_loader.get_library_path())
_lib.espeak_Initialize.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_char_p, ctypes.c_int]
_lib.espeak_SetVoiceByName.argtypes = [ctypes.c_char_p]
_lib.espeak_TextToPhonemes.restype = ctypes.c_char_p
_lib.espeak_TextToPhonemes.argtypes = [ctypes.POINTER(ctypes.c_void_p), ctypes.c_int, ctypes.c_int]
_lib.espeak_Initialize(2, 0, espeakng_loader.get_data_path().encode(), 0)  # AUDIO_OUTPUT_SYNCHRONOUS
_lib.espeak_SetVoiceByName(b"ru")

def word_ipa(text):
    """IPA (with stress marks) for a chunk of text without punctuation."""
    buf = ctypes.create_string_buffer(text.encode("utf-8"))
    ptr = ctypes.c_void_p(ctypes.addressof(buf))
    out = []
    while ptr.value:
        r = _lib.espeak_TextToPhonemes(ctypes.byref(ptr), 1, 0x02)  # UTF8 in, IPA out
        if r: out.append(r.decode("utf-8"))
    return " ".join(out).strip()

# Words whose espeak stress is wrong get a hand-written IPA here (filled after review).
STRESS_FIX = {
    "уже": "uʒˈɛ",            # espeak gives УЖе; correct is ужЕ
    "по-разному": "pʌrˈaznʌmu",  # espeak double-stresses по-
}
# Unstressed clitics are spoken together with the next word (a lone "в" is read as the letter "вэ").
CLITICS = {"в", "к", "с", "за", "на", "из", "не", "по", "до", "от", "о", "об", "у"}

def clause_ipa(clause):
    words = [w.lower().strip("«»\"") for w in clause.split()]
    parts, i = [], 0
    while i < len(words):
        w = words[i]
        if w in CLITICS and i + 1 < len(words) and words[i + 1] not in STRESS_FIX:
            parts.append(word_ipa(w + " " + words[i + 1]).replace(" ", "")); i += 2; continue
        parts.append(STRESS_FIX.get(w) or word_ipa(w)); i += 1
    return " ".join(parts)

PUNCT = set(",.?!:;")
def text_to_phonemes(text):
    """Split into clauses, keep the terminator after each, like piper-phonemize."""
    text = text.replace("—", ",").replace("«", "").replace("»", "").replace("…", ".")
    out = ""
    for m in re.finditer(r"([^,.?!:;]+)([,.?!:;]*)", text):
        body, term = m.group(1).strip(), m.group(2)[:1]
        if not body: continue
        out += clause_ipa(body) + (term or "") + " "
    return out.replace("\"", "").strip()

class Voice:
    def __init__(self, name="ruslan"):
        d = f"/home/user/tts/vits-piper-ru_RU-{name}-medium/ru_RU-{name}-medium"
        self.cfg = json.load(open(d + ".onnx.json"))
        self.idmap = self.cfg["phoneme_id_map"]
        self.sr = self.cfg["audio"]["sample_rate"]
        so = ort.SessionOptions(); so.intra_op_num_threads = 4
        self.sess = ort.InferenceSession(d + ".onnx", so)

    def ids(self, phonemes):
        m = self.idmap
        ids = m["^"] + m["_"]
        for ch in phonemes:
            if ch in m: ids += m[ch] + m["_"]
        return ids + m["$"]

    def synth(self, phonemes, length_scale=1.0, noise_scale=0.6, noise_w=0.7):
        ids = np.array([self.ids(phonemes)], dtype=np.int64)
        audio = self.sess.run(None, {
            "input": ids,
            "input_lengths": np.array([ids.shape[1]], dtype=np.int64),
            "scales": np.array([noise_scale, length_scale, noise_w], dtype=np.float32),
        })[0]
        return audio.squeeze().astype(np.float32)
