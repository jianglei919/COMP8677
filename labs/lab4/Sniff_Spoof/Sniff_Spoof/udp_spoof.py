#!/usr/bin/python3
from scapy.all import *

print("SENDING SPOOFED UDP PACKET.........")
ip = IP(src="10.9.0.5", dst="10.0.2.14") # IP Layer
udp = UDP(sport=8888, dport=5000)       # UDP Layer
data = "Hello UDP!\n"                   # Payload
pkt = ip/udp/data      # Construct the complete packet
pkt.show()
send(pkt,verbose=0, iface="enp0s3")

