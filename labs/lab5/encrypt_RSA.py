from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

with open("public.pem", "rb") as f:
    RsaKey = RSA.import_key(f.read())

message = b"Lei Jiang 110208645"

Cipher = PKCS1_OAEP.new(RsaKey)
ciphertext = Cipher.encrypt(message)

with open("ciphertext.bin", "wb") as f:
    f.write(ciphertext)

print(f"Plaintext : {message.decode()}")
print(f"Ciphertext length: {len(ciphertext)} bytes")
print(f"Ciphertext (hex): {ciphertext.hex()}")
print("Saved to ciphertext.bin")
