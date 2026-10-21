#!/usr/bin/env python3
"""Encrypt the content of a paid unit (AES-256-GCM, one key per unit).

    python3 seal.py <unit-id> <file> [<file> ...]      e.g. seal.py pc-u2 site/docs/pc/u2-*.pdf

Each <file> is replaced by <file>.enc (12-byte IV followed by ciphertext and tag); the clear file is deleted.
Keys are kept in keys.local.json next to this script (never commit it). A new unit gets a new key, printed
so that it can be pasted into the Keys sheet (Unit | Key). The browser decrypts with WebCrypto once the
backend has returned the key to a student whose access is active."""
import os, sys, json, base64, secrets
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

HERE = os.path.dirname(os.path.abspath(__file__))
STORE = os.path.join(HERE, "keys.local.json")

def b64u(b): return base64.urlsafe_b64encode(b).decode().rstrip("=")
def unb64u(s): return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))

def keys():
    return json.load(open(STORE)) if os.path.exists(STORE) else {}

def key_for(unit, create=True):
    k = keys()
    if unit not in k:
        if not create: raise KeyError(unit)
        k[unit] = b64u(secrets.token_bytes(32))
        json.dump(k, open(STORE, "w"), indent=1)
        print(f"NEW KEY for {unit}: {k[unit]}")
    return unb64u(k[unit])

def seal_bytes(data, unit):
    iv = secrets.token_bytes(12)
    return iv + AESGCM(key_for(unit)).encrypt(iv, data, None)

def seal_file(path, unit, keep=False):
    out = path + ".enc"
    open(out, "wb").write(seal_bytes(open(path, "rb").read(), unit))
    if not keep: os.remove(path)
    return out

if __name__ == "__main__":
    unit, files = sys.argv[1], sys.argv[2:]
    for f in files: seal_file(f, unit)
    print(f"{len(files)} file(s) sealed for {unit}")
