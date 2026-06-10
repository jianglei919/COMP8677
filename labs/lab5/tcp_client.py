import socket
import struct
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.Random import random, get_random_bytes
from Crypto.Util.Padding import pad, unpad

P = 2582249878086908589655919172003011874329705792829223512830659356540647622016841194629645353280137831435903171972747559779
G = 2

HOST = "127.0.0.1"
PORT = 9999


def send_msg(sock, data: bytes) -> None:
    sock.sendall(struct.pack(">I", len(data)) + data)


def recv_exact(sock, n: int) -> bytes:
    buf = b""
    while len(buf) < n:
        chunk = sock.recv(n - len(buf))
        if not chunk:
            raise ConnectionError("connection closed")
        buf += chunk
    return buf


def recv_msg(sock) -> bytes:
    (length,) = struct.unpack(">I", recv_exact(sock, 4))
    return recv_exact(sock, length)


def dh_handshake(sock) -> bytes:
    x = random.getrandbits(400)
    X = pow(G, x, P)
    send_msg(sock, str(X).encode())
    Y = int(recv_msg(sock).decode())
    shared = pow(Y, x, P)
    sk = SHA256.new(shared.to_bytes((shared.bit_length() + 7) // 8, "big")).digest()
    return sk


def aes_encrypt(sk: bytes, plaintext: bytes) -> bytes:
    iv = get_random_bytes(16)
    cipher = AES.new(sk, AES.MODE_CBC, iv)
    return iv + cipher.encrypt(pad(plaintext, AES.block_size))


def aes_decrypt(sk: bytes, blob: bytes) -> bytes:
    iv, ct = blob[:16], blob[16:]
    cipher = AES.new(sk, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size)


def main():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((HOST, PORT))
        print(f"[client] connected to {HOST}:{PORT}")
        sk = dh_handshake(sock)
        print(f"[client] sk (hex) = {sk.hex()}")

        # Send one chat message
        message = b"Hi server, this is Lei Jiang (110208645). Secret: lab5 works!"
        C = aes_encrypt(sk, message)
        tag = SHA256.new(C).digest()
        print(f"[client] plaintext       : {message.decode()}")
        print(f"[client] ciphertext  (hex): {C.hex()}")
        print(f"[client] tag         (hex): {tag.hex()}")
        send_msg(sock, C)
        send_msg(sock, tag)

        # Receive reply
        C2 = recv_msg(sock)
        tag2 = recv_msg(sock)
        if SHA256.new(C2).digest() != tag2:
            raise Exception("tag mismatch: integrity check failed")
        reply = aes_decrypt(sk, C2)
        print(f"[client] server reply    : {reply.decode()}")


if __name__ == "__main__":
    main()
