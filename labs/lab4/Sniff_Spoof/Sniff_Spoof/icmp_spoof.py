#!/usr/bin/python3
from scapy.all import *

print("SENDING SPOOFED ICMP PACKET.........")
ip = IP(src="10.9.0.5", dst="10.10.10.10") 
icmp = ICMP()
pkt = ip/icmp/"fdafdalfhal"
pkt.show2()
send(pkt)
