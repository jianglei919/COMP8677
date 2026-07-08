# COMP8677 — 期中模拟卷 #1 / Mock Midterm #1

### Networking and Data Security · 仿照老师官方样题（Shaoquan Jiang）

> **范围 Scope**：前三章 **L01–L03**（TCP/IP-I/II/III）。不含任何 security 讲座。
> **形式 Format**：**60 道单选题（MCQ）/ 1 小时**，每题 4 个选项（A–D），单选。
> **规则 Rules**：考场**不准用任何电子设备，含计算器** → 子网/幂运算靠心算。
> **题型对齐**：定义 · 术语 · 分层 · 数值计算（与官方 6 道样题同一口径）。
> **用法**：先独立做完三部分，再翻到卷末 [答案与解析](#答案与解析--answer-key) 对照。

- **Part A — Lecture 01（互联网 / 分层 / 应用层）**：Q1–Q18
- **Part B — Lecture 02（传输层 + 网络层）**：Q19–Q40
- **Part C — Lecture 03（IPv6 / 链路层 / 交换机）**：Q41–Q60

> 注：真实考试题目是**打乱混合**的；这里按章节分组只为便于自测和查漏。

---

## Part A — Lecture 01：Internet, Layering & Application Layer (Q1–Q18)

**1.** The Internet is best described as:
A. a single supercomputer
B. a circuit-switched telephone system
C. a "network of networks"
D. one large Ethernet LAN

**2.** A network _protocol_ defines:
A. only the speed of the link
B. the format and order of messages exchanged, and the actions taken on message transmission/receipt
C. only the type of physical cable used
D. the color and size of packets

**3.** In the network core, the primary job of a router is to:
A. run user applications
B. provide a wireless link to end systems
C. resolve hostnames to IP addresses
D. forward packets toward their destination

**4.** The Internet primarily uses which switching technique?
A. packet switching (store-and-forward)
B. circuit switching
C. bandwidth reservation per call
D. frequency-division reservation

**5.** What is a wireless access point (AP) used for?
A. routing
B. modulation only
C. providing a wireless link
D. providing a wired link

**6.** From top to bottom, the 5-layer Internet protocol stack is:
A. Application, Transport, Network, Link, Physical
B. Application, Network, Transport, Link, Physical
C. Physical, Link, Network, Transport, Application
D. Application, Session, Transport, Network, Physical

**7.** The PDU (protocol data unit) at the **transport** layer is called a:
A. frame
B. segment
C. datagram
D. message

**8.** The PDU at the **network** layer is called a:
A. frame
B. segment
C. message
D. datagram

**9.** A link-layer packet is called a **\_\_**:
A. a frame
B. a segment
C. a datagram
D. a payload

**10.** Which of the following is a **transport-layer** protocol?
A. HTTP
B. DNS
C. TCP
D. Ethernet

**11.** Which of the following is an **application-layer** protocol?
A. IP
B. DNS
C. TCP
D. Ethernet

**12.** During encapsulation, as data passes _down_ the stack, each layer adds its own:
A. trailer checksum only
B. IP address
C. MAC forwarding table
D. header

**13.** HTTP runs on top of which transport protocol, and on which well-known port?
A. TCP, port 80
B. UDP, port 53
C. TCP, port 25
D. UDP, port 80

**14.** HTTP follows which communication model?
A. peer-to-peer only
B. broadcast
C. client/server
D. circuit-switched

**15.** A typical web page is composed of:
A. a single image file
B. a base HTML file plus several referenced objects
C. only plain text with no objects
D. a single TCP segment

**16.** The primary function of DNS is to:
A. encrypt web traffic
B. perform packet routing
C. provide congestion control
D. translate between hostnames and IP addresses

**17.** DNS name resolution conceptually begins at which server?
A. the ROOT server
B. the authoritative server of the host
C. the local web server
D. the DHCP server

**18.** How many bits are in an IPv4 address?
A. 16
B. 32
C. 48
D. 128

---

## Part B — Lecture 02：Transport & Network Layer (Q19–Q40)

**19.** TCP is best described as:
**A. connection-oriented and reliable**
B. connectionless and unreliable
C. connectionless but reliable
D. broadcast-based

**20.** Which statement about UDP is correct?
A. it is connection-oriented
B. it guarantees in-order delivery
**C. it is connectionless and best-effort**
D. it provides flow control

**21.** Which service is provided by **neither** TCP nor UDP?
A. multiplexing / demultiplexing
B. error detection via checksum
C. port-based addressing
**D. a minimum bandwidth (throughput) guarantee**

**22.** What information is required for transport-layer **UDP** demultiplexing?
A. source IP, dest IP, source port, dest port
**B. only the destination port**
C. only the source port
D. source and destination MAC addresses

**23.** **TCP** demultiplexing directs a segment to the correct socket based on:
A. only the destination port
B. only the source port
**C. the 4-tuple (source IP, source port, dest IP, dest port)**
D. the destination MAC address

**24.** The main purpose of the UDP checksum is to:
**A. detect bit errors introduced during transmission**
B. encrypt the segment
C. control congestion
D. guarantee delivery

**25.** The UDP checksum can:
A. detect and correct errors
B. correct errors but not detect them
C. neither detect nor correct errors
**D. detect errors but not correct them**

**26.** In TCP's three-way handshake, the correct order of segments is:
**A. SYN → SYN+ACK → ACK**
B. ACK → SYN → SYN+ACK
C. SYN → ACK → SYN+ACK
D. SYN+ACK → SYN → ACK

**27.** If a SYN packet has sequence number 123, what is the sequence number of the ACK packet (the reply for the SYN-ACK) sent by the **same sender**?
A. 123
**B. 124**
C. 125
D. undetermined

**28.** A SYN (or FIN) segment consumes how many sequence numbers?
A. 0
**B. 1**
C. 2
D. it depends on the payload size

**29.** TCP flow control is used to prevent:
A. network congestion
B. routing loops
C. IP fragmentation
**D.** overflow of the **receiver's** buffer

**30.** TCP flow control is implemented using which header field?
A. checksum
B. TTL
**C. receive window**
D. sequence number

**31.** Which mechanism protects the **network** (rather than the receiving host) from being overwhelmed?
A. flow control
B. demultiplexing
C. fragmentation
**D. congestion control**

**32.** Moving a packet from a router's input port to the appropriate output port is called:
A. routing
B. multiplexing
**C. forwarding**
D. flooding

**33.** Determining the end-to-end path a packet takes from source to destination is called:
**A. routing**
B. forwarding
C. switching
D. framing

**34.** A large IP datagram that exceeds a link's MTU will be fragmented and then reassembled:
A. at every router hop
B. at the first router
C. it is never reassembled
**D. only at the final destination**

**35.** What necessitates IP fragmentation?
A. the datagram is smaller than the MTU
B. the checksum verification failed
**C. the datagram is larger than the link's MTU**
D. the TTL has reached zero

**36.** An IPv4 address identifies:
A. a process
B. a TCP connection
**C. an interface of a host or router**
D. an application

**37.** A `/30` subnet provides how many **usable** host addresses (excluding the network and broadcast addresses)?
A. 4
**B. 2**
C. 30
D. 6

**38.** In the subnet `233.1.1.0/24`, how many common (network-prefix) bits do the IP addresses share?
A. 8
**B. 24**
C. 0
D. 255

**39.** A `/26` subnet has how many host bits, and how many total addresses?
**A. 6 host bits, 64 addresses**
B. 26 host bits, 26 addresses
C. 8 host bits, 256 addresses
D. 4 host bits, 16 addresses

**40.** A host that has just joined a network obtains its IP address via DHCP, which relies on:
A. a unicast to the ROOT server
B. an ARP request
C. a TCP connection to the gateway
**D. broadcast messages**

---

## Part C — Lecture 03：IPv6, Link Layer & Switches (Q41–Q60)

**41.** An IPv6 address is how many bits long?
A. 32
B. 48
C. 64
**D. 128**

**42.** Which of the following is a field in the IPv6 header?
A. fragment offset
B. time-to-live (TTL)
C. options
**D. flow label**

**43.** The IPv6 "next header" field identifies:
A. the address of the next router
**B. the upper-layer protocol of the payload**
C. the destination subnet
D. the flow priority

**44.** The goal of a routing protocol is to:
**A. determine good paths from source to destination through the network of routers**
B. resolve IP addresses to MAC addresses
C. assign IP addresses to new hosts
D. detect bit errors in frames

**45.** In a host, the link layer is primarily implemented in the:
A. CPU
B. routing table
C. DNS resolver
**D. network interface card (NIC) / adapter**

**46.** Which of the following is an example of a **broadcast** (shared-medium) link?
A. a PPP dial-up line
**B. an 802.11 wireless LAN**
C. a point-to-point fiber link
D. a switch-to-host Ethernet link

**47.** A MAC (LAN / physical) address is how many bits long?
**A. 48**
B. 32
C. 64
D. 128

**48.** A MAC address is usually written in:
A. binary
B. decimal
**C. hexadecimal (each digit = 4 bits)**
D. octal

**49.** Which address is permanently associated with the NIC and does **not** change when the device moves to a different network?
A. the IP address
B. the port number
C. the hostname
**D. the MAC address**

**50.** ARP is used to resolve:
A. a hostname to an IP address
**B. an IP address to a MAC address (within the same subnet)**
C. a MAC address to an IP address
D. an IP address to a port number

**51.** ARP operates:
**A. only within the same subnet**
B. across the entire Internet
C. only between routers
D. only over wireless links

**52.** ARP is described as "plug-and-play" because:
A. it requires manual configuration by an administrator
B. it uses DHCP to operate
C. it needs a central registration server
**D. nodes build their ARP tables automatically, without administrator intervention**

**53.** If a link-layer switch receives a frame whose destination MAC is **not** recorded in its forwarding table, it will:
A. discard the frame
B. forward it on a single default interface
**C. flood it to all interfaces except the one it arrived on**
D. use ARP to find the correct interface

**54.** If a switch receives a frame whose destination MAC maps (in the table) to the **same** interface the frame arrived on, it will:
A. flood the frame
B. forward it to all other interfaces
C. broadcast an ARP request
**D. discard / filter the frame**

**55.** An Ethernet switch builds its forwarding table by:
A. using ARP
**B. self-learning from the source MAC and incoming interface of frames**
C. manual configuration only
D. querying a DHCP server

**56.** Compared with a hub, an Ethernet switch allows:
A. only one transmission at a time on the whole LAN
B. no simultaneous transmissions
**C. simultaneous transmissions between different host pairs without collision**
D. collisions on every port

**57.** Host A sends a datagram to host B through router R. On the **A → R** hop, the frame's _destination MAC address_ is:
**A. R's MAC**
B. B's MAC
C. A's MAC
D. the broadcast address

**58.** Continuing the previous question, on the **R → B** hop, the frame's _destination MAC address_ is:
A. A's MAC
B. R's MAC
**C. B's MAC**
D. the broadcast address

**59.** When a datagram travels across multiple routers from source to destination, what remains **unchanged** end-to-end?
A. the destination MAC address
B. the source MAC address
**C. the source and destination IP addresses**
D. the frame header

**60.** Which statement about MAC and IP addresses is **TRUE**?
A. both are 32 bits long
**B. the MAC address changes at every hop while the IP stays the same end-to-end**
C. the IP address changes at every hop while the MAC stays the same
D. they are identical

---

## 答案与解析 / Answer Key

### 快速对答案 Quick Grid

| Q   | A/K   | Q   | A/K   | Q   | A/K   | Q   | A/K   | Q   | A/K   | Q   | A/K   |
| --- | ----- | --- | ----- | --- | ----- | --- | ----- | --- | ----- | --- | ----- |
| 1   | **C** | 11  | **B** | 21  | **D** | 31  | **D** | 41  | **D** | 51  | **A** |
| 2   | **B** | 12  | **D** | 22  | **B** | 32  | **C** | 42  | **D** | 52  | **D** |
| 3   | **D** | 13  | **A** | 23  | **C** | 33  | **A** | 43  | **B** | 53  | **C** |
| 4   | **A** | 14  | **C** | 24  | **A** | 34  | **D** | 44  | **A** | 54  | **D** |
| 5   | **C** | 15  | **B** | 25  | **D** | 35  | **C** | 45  | **D** | 55  | **B** |
| 6   | **A** | 16  | **D** | 26  | **A** | 36  | **C** | 46  | **B** | 56  | **C** |
| 7   | **B** | 17  | **A** | 27  | **B** | 37  | **B** | 47  | **A** | 57  | **A** |
| 8   | **D** | 18  | **B** | 28  | **B** | 38  | **B** | 48  | **C** | 58  | **C** |
| 9   | **A** | 19  | **A** | 29  | **D** | 39  | **A** | 49  | **D** | 59  | **C** |
| 10  | **C** | 20  | **C** | 30  | **C** | 40  | **D** | 50  | **B** | 60  | **B** |

### 详细解析 Explanations

**Part A — L01**

1. **C** — 互联网是"网络的网络（network of networks）"，由端系统+路由器+链路互连而成。
2. **B** — 协议规定报文的**格式、顺序**以及收发时的**动作**。
3. **D** — 网络核心里路由器的核心工作是**转发分组**；提供无线链路是 AP，解析名字是 DNS。
4. **A** — 互联网用**分组交换 + 存储转发**；电路交换是传统电话。
5. **C** — 无线 AP 的作用 = **提供无线链路**（官方样题1）。
6. **A** — 自顶向下：**应用→传输→网络→链路→物理**（口诀"应-传-网-链-物"）。
7. **B** — 传输层 PDU = **segment 段**。
8. **D** — 网络层 PDU = **datagram 数据报**。
9. **A** — 链路层分组 = **frame 帧**（官方样题3）；段=传输层、数据报=网络层、payload 是载荷不是层级单位。
10. **C** — **TCP** 是传输层；HTTP/DNS 是应用层，Ethernet 是链路层。
11. **B** — **DNS** 是应用层；IP=网络层、TCP=传输层、Ethernet=链路层。
12. **D** — 封装时每层自顶向下**加自己的头部（header）**。
13. **A** — HTTP 跑在 **TCP** 上、端口 **80**；client/server 模型。
14. **C** — HTTP 是 **client/server** 模型。
15. **B** — 网页 = 一个**基础 HTML 文件 + 若干对象**（图片、脚本等）。
16. **D** — DNS = **主机名 ↔ IP 地址**互译；不做加密/路由/拥塞控制。
17. **A** — 名字解析从 **ROOT 根服务器**开始逐级向下。
18. **B** — IPv4 地址 = **32 位**（IPv6 是 128 位）。

**Part B — L02** 19. **A** — TCP **面向连接 + 可靠**按序字节流。20. **C** — UDP **无连接 + 尽力而为（best-effort）**；无序、无流控。21. **D** — TCP/UDP **都不**保证**带宽/延迟**；二者都提供 mux/demux、校验和、端口寻址。22. **B** — **UDP 分解只需目的端口**（官方样题4）。23. **C** — **TCP 分解看 4 元组**（源IP, 源端口, 目的IP, 目的端口）。24. **A** — UDP 校验和用于**检测传输中的比特错误**。25. **D** — 校验和**只能检错，不能纠错**。26. **A** — 三次握手：**SYN → SYN+ACK → ACK**。27. **B** — SYN seq=123，同一发送方随后的 ACK 包 seq = **124**（seq+1，官方样题5）。28. **B** — **SYN/FIN 各消耗 1 个序列号**。29. **D** — 流量控制防止**接收方缓冲区溢出**。30. **C** — 靠 TCP 头部的 **receive window（接收窗口）**字段。31. **D** — 保护**网络**的是**拥塞控制**；流量控制保护接收方。32. **C** — 输入口→输出口（路由器内部、本地动作）= **转发 forwarding**。33. **A** — 决定源到目的整条路径（全局）= **路由 routing**。34. **D** — IP 分片**只在最终目的地重组**，中间路由器不重组。35. **C** — 当数据报**大于链路 MTU** 时才需分片。36. **C** — IP 地址标识**接口（interface）**，不是进程/连接/应用。37. **B** — `/30`：主机位=32−30=2，总地址 2²=4，去掉网络号+广播号 → **可用 2 个**。38. **B** — `/24` 的共同（网络前缀）位 = **24 位**（官方样题2）。39. **A** — `/26`：主机位=32−26=**6**，总地址=2⁶=**64**。40. **D** — 新主机还没 IP，DHCP 全程靠**广播**（Discover/Offer/Request/ACK）。

**Part C — L03** 41. **D** — IPv6 地址 = **128 位**。42. **D** — **flow label（流标签）**是 IPv6 头部字段；IPv6 取消了 fragment offset/options，TTL 改名 hop limit。43. **B** — "next header" 指明**上层协议**（相当于 IPv4 的 protocol 字段）。44. **A** — 路由协议目标 = **确定穿过路由器网络的源到目的好路径**。45. **D** — 链路层在主机里实现于**网卡/适配器（NIC）**。46. **B** — **802.11 无线 LAN** 是广播（共享介质）链路；PPP、点到点光纤、交换机-主机是点到点。47. **A** — MAC 地址 = **48 位**。48. **C** — MAC 用**十六进制**表示，每个十六进制位 = 4 比特。49. **D** — **MAC 固化在网卡**、随设备走；IP 随网络位置变化。50. **B** — ARP 在**同子网内**把 **IP 解析为 MAC**。51. **A** — ARP **只在同一子网内**工作。52. **D** — "即插即用"= 节点**自动建 ARP 表、无需网管干预**。53. **C** — 目的 MAC 不在表中 → **泛洪到除入口外所有接口**（官方样题6）。54. **D** — 目的 MAC 对应的就是**入口接口** → **丢弃/过滤**（目的就在来的那一侧）。55. **B** — 交换机靠**自学习**（源 MAC + 入口接口）建表，**不是用 ARP**。56. **C** — 交换机支持**不同主机对之间同时无冲突传输**（区别于 hub）。57. **A** — A→R 这一跳，帧的目的 MAC = **R 的 MAC**（指向下一跳邻居）。58. **C** — R→B 这一跳，帧的目的 MAC = **B 的 MAC**。59. **C** — 跨多跳时**源/目的 IP 端到端不变**；MAC 逐跳变化。60. **B** — **MAC 逐跳变、IP 端到端不变**；MAC 48 位、IP 32 位，二者不同。

---

### 📌 高频/易错速记（对照本卷）

- **PDU 对应层**：message·**segment(传输)**·**datagram(网络)**·**frame(链路)**·bit（Q7–9, 17→记 ROOT 起点）。
- **UDP 分解只看目的端口；TCP 看 4 元组**（Q22–23）。
- **子网 `/x`**：共同位=x，主机位=32−x，地址数=2^(32−x)，可用=−2（Q37–39）。心算 2 的幂：2⁶=64、2⁸=256。
- **三次握手** SYN seq=x → 下一包 x+1；SYN/FIN 各占 1 序号（Q27–28）。
- **流控护接收方 / 拥塞控制护网络**（Q29–31）。
- **交换机**：未知目的 MAC→**泛洪**；同入口→丢弃；建表靠**自学习**不是 ARP（Q53–55）。
- **跨子网**：**IP 不变、MAC 逐跳变**，第一跳目的 MAC 是路由器 R（Q57–60）。

> 想要 **第 2 套**（换数字与措辞）、把本卷导出为 **Word/PDF**、或加一份**纯空白答题卡**，跟我说即可。
