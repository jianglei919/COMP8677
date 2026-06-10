from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

with open("private.pem", "rb") as f:
    RsaKey = RSA.import_key(f.read(), passphrase="lab5pass")

with open("ciphertext.bin", "rb") as f:
    ctxt = f.read()

Cipher = PKCS1_OAEP.new(RsaKey)
message = Cipher.decrypt(ctxt)

print(f"Ciphertext length: {len(ctxt)} bytes")
print(f"Decrypted message: {message.decode()}")
