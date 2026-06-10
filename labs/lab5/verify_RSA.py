from Crypto.PublicKey import RSA
from Crypto.Hash import SHA512
from Crypto.Signature import pss

with open("public.pem", "rb") as f:
    RsaKey = RSA.import_key(f.read())

with open("signature.bin", "rb") as f:
    signature = f.read()

M = b"I owe you $2000"
h = SHA512.new(M)

verifier = pss.new(RsaKey, salt_bytes=32)
try:
    verifier.verify(h, signature)
    print(f"Message  : {M.decode()}")
    print("Signature is VALID.")
except (ValueError, TypeError):
    print("Signature is INVALID.")

M_bad = b"I owe you $3000"
h_bad = SHA512.new(M_bad)
try:
    verifier.verify(h_bad, signature)
    print(f"Tampered : {M_bad.decode()} -> VALID (unexpected)")
except (ValueError, TypeError):
    print(f"Tampered : {M_bad.decode()} -> INVALID (as expected)")
