#!/usr/bin/python3
from scapy.all import *

print("SNIFFING PACKETS.........")
def print_pkt(pkt):
   print("Source IP:", pkt[IP].src)
   print("Destination IP:", pkt[IP].dst)
   print("Protocol:", pkt[IP].proto)
   print("\n")

pkt = sniff(filter='icmp',iface="br-0fa57b601c07", count=5, prn=print_pkt)
pkt[2].show2()
