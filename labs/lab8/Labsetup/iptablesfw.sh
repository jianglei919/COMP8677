#!/bin/bash    
#.sh file a text file containing commands. 
# executing the file uses $ sudo bash filename.sh


# Allow SSH and HTTP
iptables -A OUTPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --sport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
#iptables -A OUTPUT -p tcp  -j ACCEPT             
iptables -A OUTPUT -p tcp -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -I INPUT 1 -i lo -j ACCEPT

# Allow DNS
iptables -A OUTPUT -p udp  --dport 53 -j ACCEPT
iptables -A OUTPUT -p udp  --sport 53 -j ACCEPT
iptables -A INPUT  -p udp  --sport 53 -j ACCEPT
iptables -A INPUT  -p udp  --dport 53 -j ACCEPT

# Set default filter policy to DROP.
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARD DROP

