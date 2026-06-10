#!/usr/bin/python3

import socket, ssl, pprint

html = """
HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n
<!DOCTYPE html><html><body><h1>This is our COMP8677 Class!</h1></body></html>
"""

SERVER_CERT    = '/volumes/certS/Test.crt'
SERVER_PRIVATE = '/volumes/certS/Test.key'


context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)     
context.load_cert_chain(SERVER_CERT, SERVER_PRIVATE)

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) 
sock.bind(('10.9.0.5', 4433))
sock.listen(5)

while True:
   newsock, fromaddr = sock.accept()
   print("TCP connect")
   try :
     ssock = context.wrap_socket(newsock, server_side=True)
     print("TLS connection established")
     data = ssock.recv(1024)              # Read data over TLS
     pprint.pprint("Request: {}".format(data))
     ssock.sendall(html.encode('utf-8'))  # Send data over TLS

     ssock.shutdown(socket.SHUT_RDWR)     # Close the TLS connection
     ssock.close()

   except Exception:
     print("TLS connection fails")
     continue
