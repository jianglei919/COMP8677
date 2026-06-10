const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun,
  AlignmentType, HeadingLevel, LevelFormat, PageOrientation,
} = require("docx");

const SCREENS = "/Users/logcabin/Workspace/uwindsor/COMP8677/labs/lab5/screens";
const LAB = "/Users/logcabin/Workspace/uwindsor/COMP8677/labs/lab5";

function img(file, maxW) {
  const buf = fs.readFileSync(path.join(SCREENS, file));
  // Read intrinsic size via PNG header (IHDR width/height at bytes 16-23)
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const scale = Math.min(1, maxW / w);
  return new ImageRun({
    type: "png",
    data: buf,
    transformation: { width: Math.round(w * scale), height: Math.round(h * scale) },
    altText: { title: file, description: file, name: file },
  });
}

function P(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, ...opts })],
    spacing: { after: 120 },
  });
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text })],
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text })],
  });
}

function code(text) {
  return text.split("\n").map(line =>
    new Paragraph({
      children: [new TextRun({ text: line || " ", font: "Courier New", size: 18 })],
      spacing: { after: 0 },
    })
  );
}

function figure(file, caption, maxW = 600) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [img(file, maxW)],
      spacing: { before: 120, after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: caption, italics: true, size: 20 })],
      spacing: { after: 200 },
    }),
  ];
}

const clientCode = fs.readFileSync(path.join(LAB, "tcp_client.py"), "utf8");
const serverCode = fs.readFileSync(path.join(LAB, "tcp_server.py"), "utf8");

const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "COMP8677 — Lab 5 Report", bold: true, size: 36 })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Lei Jiang  ·  Student ID: 110208645", size: 22 })],
    spacing: { after: 360 },
  }),

  // ===== Task 1 =====
  H1("1. Generating an RSA Key Pair with OpenSSL"),
  P("A 1024-bit RSA private key was generated using openssl genrsa with AES-128 encryption protecting the output PEM file. The corresponding public key was then extracted from the private key file. The exact commands used:"),
  ...code(
`$ openssl genrsa -aes128 -out private.pem 1024
$ openssl rsa -in private.pem -pubout > public.pem
$ openssl rsa -in private.pem -text -noout
$ openssl rsa -in public.pem -pubin -text -noout`
  ),
  P(" "),
  P("The private key file private.pem stores the full RSA parameters (p, q, d, e, n) encrypted under a passphrase. The dumped contents are shown below."),
  ...figure("Task1-private.png", "Figure 1.1 — Contents of private.pem (modulus, publicExponent, privateExponent, prime1, prime2, etc.)", 380),
  P("The public key file public.pem contains only (e, n)."),
  ...figure("Task1-public.png", "Figure 1.2 — Contents of public.pem (Modulus and Exponent)"),

  // ===== Task 2 =====
  H1("2. RSA Encryption and Decryption with PKCS1_OAEP"),
  H2("2.1  Encryption"),
  P("The script encrypt_RSA.py loads the public key from public.pem, builds a PKCS1_OAEP cipher object, and encrypts the message \"Lei Jiang 110208645\". The 128-byte ciphertext is written to ciphertext.bin. Key code:"),
  ...code(
`from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

with open("public.pem", "rb") as f:
    RsaKey = RSA.import_key(f.read())

message = b"Lei Jiang 110208645"
Cipher  = PKCS1_OAEP.new(RsaKey)
ciphertext = Cipher.encrypt(message)

with open("ciphertext.bin", "wb") as f:
    f.write(ciphertext)`
  ),
  P(" "),
  P("Running the script and dumping the produced ciphertext with hexdump -C ciphertext.bin:"),
  ...figure("Task2a.png", "Figure 2.1 — hexdump of ciphertext.bin (128 bytes, matches the 1024-bit RSA modulus length)"),

  H2("2.2  Decryption"),
  P("The script decrypt_RSA.py loads the AES-128 protected private key from private.pem (passphrase prompted/supplied), builds a PKCS1_OAEP cipher object, reads ciphertext.bin, and recovers the original plaintext:"),
  ...code(
`from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP

with open("private.pem", "rb") as f:
    RsaKey = RSA.import_key(f.read(), passphrase="lab5pass")

with open("ciphertext.bin", "rb") as f:
    ctxt = f.read()

Cipher  = PKCS1_OAEP.new(RsaKey)
message = Cipher.decrypt(ctxt)
print(message.decode())`
  ),
  P(" "),
  ...figure("Task2b.png", "Figure 2.2 — Decryption output: the recovered plaintext is \"Lei Jiang 110208645\", identical to the original message."),

  // ===== Task 3 =====
  H1("3. RSA Signature Generation and Verification (Optional)"),
  H2("3.1  Signing"),
  P("Using Crypto.Signature.pss with a SHA-512 hash, two messages were signed with the same private key: M1 = \"I owe you $2000\" and M2 = \"I owe you $3000\". Because the default PSS salt length (= digest length = 64 bytes) exceeds what a 1024-bit RSA modulus can accommodate, an explicit salt_bytes=32 was supplied. Key code:"),
  ...code(
`from Crypto.PublicKey import RSA
from Crypto.Hash      import SHA512
from Crypto.Signature import pss

RsaKey = RSA.import_key(open("private.pem","rb").read(), passphrase="lab5pass")
signer = pss.new(RsaKey, salt_bytes=32)

sig1 = signer.sign(SHA512.new(b"I owe you $2000"))
sig2 = signer.sign(SHA512.new(b"I owe you $3000"))
open("signature.bin","wb").write(sig1)`
  ),
  P(" "),
  P("Comparing the two signatures byte-by-byte showed that all 128/128 bytes differ — a one-character change in the message ($2000 → $3000) completely scrambles the signature. This is the avalanche property expected from a secure hash + signature scheme. The hexdump of signature.bin (the signature of M1) is shown below."),
  ...figure("Task3a.png", "Figure 3.1 — Signing output (both signatures + comparison) and hexdump of signature.bin"),

  H2("3.2  Verification"),
  P("verify_RSA.py loads public.pem, the saved signature, and re-hashes the original message with SHA-512 to verify. A second verification is then attempted against the tampered message \"I owe you $3000\", which is correctly rejected:"),
  ...code(
`verifier = pss.new(RsaKey_pub, salt_bytes=32)
verifier.verify(SHA512.new(b"I owe you $2000"), signature)   # VALID
verifier.verify(SHA512.new(b"I owe you $3000"), signature)   # raises ValueError`
  ),
  P(" "),
  ...figure("Task3b.png", "Figure 3.2 — Verification result: the original signature is VALID; verifying against the tampered message yields INVALID, confirming integrity protection."),

  // ===== Task 4 =====
  H1("4. Authenticated Diffie-Hellman Chat over TCP"),
  P("A TCP client and a TCP server were implemented that perform a Diffie-Hellman key exchange, derive a 32-byte session key sk via SHA-256, and then exchange one authenticated, AES-encrypted chat message in each direction."),

  H2("4.1  Diffie-Hellman Parameters and Key Derivation"),
  P("The DH parameters specified by the assignment were used unchanged:"),
  ...code(
`p = 2582249878086908589655919172003011874329705792829223512830659356540
    647622016841194629645353280137831435903171972747559779
g = 2

# Private exponents (one per side)
x = Crypto.Random.random.getrandbits(400)   # client
y = Crypto.Random.random.getrandbits(400)   # server

# Public values exchanged over the socket
X = pow(g, x, p)
Y = pow(g, y, p)

# Shared secret (same on both sides)
K  = pow(Y, x, p) == pow(X, y, p)
sk = SHA256(K.to_bytes(...)).digest()       # 32-byte AES key`
  ),

  H2("4.2  Message Encryption and Authentication"),
  P("The sender encrypts the plaintext chat message with AES-CBC using sk as the key and a fresh 16-byte random IV (prepended to the ciphertext). It then computes tag = SHA-256(C) and sends (C, tag) over the socket. The receiver re-hashes the received ciphertext, compares it with the received tag, and only decrypts when they match — otherwise an exception is raised."),

  H2("4.3  Client / Server Run"),
  P("The server was started first, then the client connected and sent one chat message. The terminal output of each side is shown below. The sk computed by the two sides is byte-identical, the SHA-256 tag matches, and the decrypted message at the server equals what the client encrypted."),
  ...figure("Task4a.png", "Figure 4.1 — Client output: sk, ciphertext C, tag, and the reply received from the server."),
  ...figure("Task4b.png", "Figure 4.2 — Server output: same sk as the client, received C and tag (verified), and the recovered plaintext message."),

  H2("4.4  Source Code — tcp_client.py"),
  ...code(clientCode),
  new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 200 } }),

  H2("4.5  Source Code — tcp_server.py"),
  ...code(serverCode),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Calibri" },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(LAB, "Lab5_Report.docx");
  fs.writeFileSync(out, buf);
  console.log("Wrote", out, buf.length, "bytes");
});
