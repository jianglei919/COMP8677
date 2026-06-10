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


def dh_handshake(conn) -> bytes:
    y = random.getrandbits(400)
    Y = pow(G, y, P)
    X = int(recv_msg(conn).decode())
    send_msg(conn, str(Y).encode())
    shared = pow(X, y, P)
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
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as srv:
        srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        srv.bind((HOST, PORT))
        srv.listen(1)
        print(f"[server] listening on {HOST}:{PORT}")
        conn, addr = srv.accept()
        with conn:
            print(f"[server] client connected: {addr}")
            sk = dh_handshake(conn)
            print(f"[server] sk (hex) = {sk.hex()}")

            # Receive one message from client
            C = recv_msg(conn)
            tag = recv_msg(conn)
            print(f"[server] received C   (hex) = {C.hex()}")
            print(f"[server] received tag (hex) = {tag.hex()}")
            expected = SHA256.new(C).digest()
            if expected != tag:
                raise Exception("tag mismatch: integrity check failed")
            plaintext = aes_decrypt(sk, C)
            print(f"[server] decrypted message: {plaintext.decode()}")

            # Reply
            reply = b"Hello from server: message received."
            C2 = aes_encrypt(sk, reply)
            tag2 = SHA256.new(C2).digest()
            send_msg(conn, C2)
            send_msg(conn, tag2)
            print(f"[server] replied with: {reply.decode()}")


if __name__ == "__main__":
    main()
