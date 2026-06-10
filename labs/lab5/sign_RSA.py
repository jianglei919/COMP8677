from Crypto.PublicKey import RSA
from Crypto.Hash import SHA512
from Crypto.Signature import pss

with open("private.pem", "rb") as f:
    RsaKey = RSA.import_key(f.read(), passphrase="lab5pass")

M1 = b"I owe you $2000"
M2 = b"I owe you $3000"

signer = pss.new(RsaKey, salt_bytes=32)

h1 = SHA512.new(M1)
sig1 = signer.sign(h1)

h2 = SHA512.new(M2)
sig2 = signer.sign(h2)

with open("signature.bin", "wb") as f:
    f.write(sig1)

print(f"Message 1 : {M1.decode()}")
print(f"Signature1 (hex):\n{sig1.hex()}")
print()
print(f"Message 2 : {M2.decode()}")
print(f"Signature2 (hex):\n{sig2.hex()}")
print()

diff_bytes = sum(a != b for a, b in zip(sig1, sig2))
print(f"Signatures differ in {diff_bytes}/{len(sig1)} bytes -> NOT similar (avalanche effect)")
print("Signature1 saved to signature.bin")
