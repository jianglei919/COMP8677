#!/usr/bin/python3

import socket, ssl, sys, pprint

hostname = sys.argv[1] # this will use hostname (e.g., client1-10.9.0.5) 
port = 4433
#cadir = '/etc/ssl/certs'       #this is the official location of your CA certificates.
cadir = '/volumes/certC'        #this is the location of your demo_CA certificate

# Set up the TLS context
context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_verify_locations(capath=cadir)
context.verify_mode = ssl.CERT_REQUIRED
context.check_hostname = True

# TCP handshake
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((hostname, port))

# TLS handshake
ssock = context.wrap_socket(sock, server_hostname=hostname, do_handshake_on_connect=False)
ssock.do_handshake()   # Start the handshake

# Send HTTP Request to Server
request = b"GET / HTTP/1.0\r\nHost: " + hostname.encode() + b"\r\n\r\n"
ssock.sendall(request)
# Read HTTP Response from Server
response = ssock.recv(2048)
while response:
      pprint.pprint(response)
      response = ssock.recv(2048)

# Close the TLS Connection
ssock.shutdown(socket.SHUT_RDWR)
ssock.close()


