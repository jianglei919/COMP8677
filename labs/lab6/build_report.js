// Lab 6 report — content only. Boilerplate lives in ../report-lib.js
//   cd labs && npm install         (once)
//   node lab6/build_report.js
const { makeReport } = require("../report-lib");

const serverCode =
`#!/usr/bin/python3
import socket, ssl
from _thread import start_new_thread

SERVER_CERT    = '/volumes/certS/Test.crt'
SERVER_PRIVATE = '/volumes/certS/Test.key'

context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_cert_chain(SERVER_CERT, SERVER_PRIVATE)

# One thread per client -> several clients can talk at the same time
def handle_client(newsock, fromaddr):
    ssock = None
    try:
        ssock = context.wrap_socket(newsock, server_side=True)
        print("TLS established with {}".format(fromaddr))
        data = ssock.recv(1024)
        while data:
            text  = data.decode('utf-8')
            reply = text[::-1]                 # reverse the message
            print("{} sent {!r} -> replying {!r}".format(fromaddr, text, reply))
            ssock.sendall(reply.encode('utf-8'))
            data = ssock.recv(1024)
        print("{} closed the connection".format(fromaddr))
    except Exception as e:
        print("connection with {} failed: {}".format(fromaddr, e))
    finally:
        target = ssock if ssock is not None else newsock
        try: target.shutdown(socket.SHUT_RDWR)
        except Exception: pass
        try: target.close()
        except Exception: pass

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind(('0.0.0.0', 4433))
sock.listen(5)
print("TLS server listening on 0.0.0.0:4433 ...")

while True:
    newsock, fromaddr = sock.accept()
    print("TCP connect from {}".format(fromaddr))
    start_new_thread(handle_client, (newsock, fromaddr))`;

const clientCode =
`#!/usr/bin/python3
import socket, ssl, sys

hostname = sys.argv[1]          # e.g. server-10.9.0.2 (must match cert CN)
port  = 4433
cadir = '/volumes/certC'        # our demo CA cert (+ hash link) lives here

context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_verify_locations(capath=cadir)
context.verify_mode = ssl.CERT_REQUIRED
context.check_hostname = True

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((hostname, port))
ssock = context.wrap_socket(sock, server_hostname=hostname)
print("TLS established with {}. Type a message (empty line to quit).".format(hostname))

try:
    while True:
        try:
            msg = input("> ")
        except EOFError:
            break
        if msg == "":
            break
        ssock.sendall(msg.encode('utf-8'))
        resp = ssock.recv(2048)
        if not resp:
            print("server closed the connection")
            break
        print("server replied: {}".format(resp.decode('utf-8')))
finally:
    try: ssock.shutdown(socket.SHUT_RDWR)
    except Exception: pass
    ssock.close()`;

makeReport({
  labDir: __dirname,
  outName: "Lab6_Report.docx",
  title: "COMP8677 — Lab 6 Report",
  subtitle: "A TLS-Protected TCP Server",
  author: "Lei Jiang  ·  Student ID: 110208645",
  body: ({ P, H1, H2, code, figure, spacer }) => [
    // ===== Objective =====
    H1("1. Objective"),
    P("This lab builds a TLS-protected TCP server in the SEED-Ubuntu Docker environment (four containers: server-10.9.0.2 and client1/2/3 on the 10.9.0.0/24 network). It has two parts. In Part I we act as our own root Certificate Authority (CA): the CA generates its own self-signed certificate and then issues an X.509 certificate for the TLS server. In Part II we modify a basic TLS client/server so that the client interactively exchanges messages with the server, the server reverses each message and returns it, and the server handles multiple clients concurrently using threads."),

    // ===== Part I =====
    H1("2. Part I — Creating the Server Key and a CA-Signed Certificate"),
    P("The goal of Part I is a complete trust chain: a self-signed root CA (demo_ca.crt) that signs the server certificate (Test.crt), whose Common Name equals the server container name server-10.9.0.2. The server later presents Test.crt; the client verifies it against the CA certificate."),

    H2("2.1  OpenSSL configuration and CA database"),
    P("A copy of the system openssl.cnf was placed in the working directory and its CA policy was relaxed from policy_match to policy_anything so the CA may sign requests whose DN fields differ from its own. The CA database scaffold (demoCA) was then created with an initial serial number:"),
    ...code(
`$ cp /usr/lib/ssl/openssl.cnf .
$ sed -i 's/policy = policy_match/policy = policy_anything/' openssl.cnf
$ mkdir -p demoCA/certs demoCA/crl demoCA/newcerts
$ touch demoCA/index.txt
$ echo 1000 > demoCA/serial`
    ),

    H2("2.2  Root CA (self-signed)"),
    P("The CA generated its own RSA private key and a self-signed certificate valid for 365 days. The CA's Common Name was set to \"SEED Demo CA\"; the private key demo_ca.key is protected by a passphrase entered at this step."),
    ...code(
`$ openssl req -new -x509 -keyout demo_ca.key -out demo_ca.crt \\
        -config openssl.cnf -days 365`
    ),

    H2("2.3  Server private key, CSR, and CA-signed certificate"),
    P("A 2048-bit RSA key (AES-128 encrypted) was generated for the server. A certificate signing request was then created with the Common Name set to server-10.9.0.2 — this is critical, because the client enables hostname checking (check_hostname = True) and will compare the name it connects to against the certificate. Finally the CA signed the request, producing Test.crt:"),
    ...code(
`$ openssl genrsa -aes128 -out Test.key 2048

$ openssl req -new -key Test.key -out Test.csr -config openssl.cnf \\
        -subj "/C=CA/ST=Ontario/L=Windsor/O=UWindsor/OU=COMP8677/CN=server-10.9.0.2"

$ openssl ca -in Test.csr -out Test.crt \\
        -cert demo_ca.crt -keyfile demo_ca.key -config openssl.cnf`
    ),

    H2("2.4  Installing the certificates and verifying the chain"),
    P("The server certificate and key were copied to certS (loaded by the server); the CA certificate was copied to certC (used by the client). Because the client locates the CA certificate by its subject hash, a symbolic link named <hash>.0 was created. The chain was then verified using the same CApath lookup the client performs:"),
    ...code(
`$ cp Test.crt Test.key  /volumes/certS/
$ cp demo_ca.crt        /volumes/certC/
$ cd /volumes/certC
$ HASH=$(openssl x509 -in demo_ca.crt -noout -subject_hash)   # 12b17583
$ ln -s demo_ca.crt $HASH.0

$ openssl verify -CApath /volumes/certC /volumes/certS/Test.crt
/volumes/certS/Test.crt: OK`
    ),
    spacer(0),
    P("The full content of the issued server certificate (submission requirement c) is shown below. The Issuer is the CA (CN = SEED Demo CA) while the Subject is the server (CN = server-10.9.0.2), confirming the certificate was issued by our CA to the server identity."),
    ...figure("Part1.png", "Figure 2.1 — Server certificate content: openssl x509 -in Test.crt -text -noout. Issuer = SEED Demo CA, Subject CN = server-10.9.0.2, 2048-bit RSA public key.", 430),

    // ===== Part II =====
    H1("3. Part II — Interactive, Multi-Threaded TLS Reverse Server"),
    P("The provided client/server (a single-shot HTTP exchange) were modified to meet the two required behaviours: (1) the client interactively sends user input and prints the server's reply in a loop; (2) the server reverses each received message and returns it, while serving several clients at the same time."),

    H2("3.1  Changes to server.py"),
    P("Three changes were made relative to the provided server. The listening address was changed from a fixed client address to 0.0.0.0 so the server accepts on its own container interface. A per-client handler function was added and dispatched with _thread.start_new_thread, so the accept loop never blocks and multiple clients are served concurrently. Inside the handler the server loops on recv, reverses the text with the slice text[::-1], and sends it back until the client disconnects."),

    H2("3.2  Changes to client.py"),
    P("The client keeps the TLS setup from the template — it loads the CA certificate from certC (capath), requires a valid certificate (CERT_REQUIRED) and enables check_hostname — and replaces the single HTTP request with an interactive while loop: it reads a line with input(), sends it over the TLS socket, receives the reversed reply, prints it, and repeats until an empty line is entered."),

    H2("3.3  Running the system (one server, two clients)"),
    P("The server was started on the server-10.9.0.2 container (it prompts once for the Test.key passphrase, then listens on port 4433). Two clients were started on the client1-10.9.0.5 and client2-10.9.0.6 containers, each connecting with the server name so hostname verification succeeds:"),
    ...code(
`# server container (server-10.9.0.2)
$ python3 /volumes/server.py

# client containers (client1-10.9.0.5 and client2-10.9.0.6)
$ python3 /volumes/client.py server-10.9.0.2`
    ),
    spacer(0),
    P("The server log below shows both clients (10.9.0.5 and 10.9.0.6) establishing TLS and exchanging messages in interleaved order. A single-threaded server could not have completed the second TLS handshake while the first client was still connected — so this output demonstrates the multi-threaded requirement."),
    ...figure("Part2-server.png", "Figure 3.1 — Server terminal: two clients (10.9.0.5 and 10.9.0.6) connected concurrently, each message reversed and returned (hello→olleh, world→dlrow, COMP8677→7768PMOC, seed→dees, lab→bal).", 600),
    P("The two client terminals confirm the interactive loop and the certificate verification (TLS established with server-10.9.0.2)."),
    ...figure("Part2-client1.png", "Figure 3.2 — Client 1 (client1-10.9.0.5): hello→olleh, seed→dees, lab→bal.", 350),
    ...figure("Part2-client2.png", "Figure 3.3 — Client 2 (client2-10.9.0.6): world→dlrow, COMP8677→7768PMOC.", 350),
    P("Both clients verified the server certificate against the CA in certC (no hostname mismatch, since the certificate CN matches server-10.9.0.2), exchanged several messages interactively, and received the correctly reversed strings — satisfying both Part II requirements."),

    H2("3.4  Source code — server.py"),
    ...code(serverCode),
    spacer(),

    H2("3.5  Source code — client.py"),
    ...code(clientCode),
  ],
});
