# Lecture 04 — Packet Sniffing & Spoofing（嗅探与伪造）

> 📘 源文件：`lectures/Lecture - 04 - L_Sniff-Spoof-1.pptx`（SEED Lab 风格，授课：Shaoquan Jiang）
> ⛔ **不在本次期中范围**（公告："No security lectures will be included"）—— 供后续/期末复习
> 🧪 配套实验：`labs/`（Scapy 嗅探/伪造）

---

## 一句话概览
**嗅探**=让网卡进入**混杂模式**抓取本不属于自己的包；**伪造**=用**原始套接字(raw socket)**自己拼装各层头部发出去。工具核心是 **Scapy**。

---

## 一、知识点提纲
1. 网卡 NIC 回顾与正常收包逻辑
2. 嗅探原理：混杂模式（promiscuous mode）
3. 能嗅探到什么（共享介质）
4. 普通 socket vs 原始 socket（raw socket）
5. Scapy 构造包、查看包
6. Scapy 嗅探：`sniff()` 参数与 BPF 过滤
7. 访问包的各层字段
8. Scapy 发送：`send()` vs `sendp()`
9. 伪造与"先嗅探后伪造"

---

## 二、核心概念详解

### 1. 网卡 NIC 与正常收包
- **NIC（网络接口卡）**：连接机器与网络的物理/逻辑设备；每块 NIC 有一个 **MAC 地址**并被分配 **IP 地址**（`ifconfig -a` 查看，如 `enp0s3`、回环 `lo` 127.0.0.1）。
- **正常逻辑**：网络上的每块 NIC 其实**都能听到**到达它的所有帧；NIC 检查每个帧的**目的 MAC**：
  - = 自己的 MAC → 交给 CPU；
  - ≠ 自己的 MAC → **丢弃**。

### 2. 嗅探原理：混杂模式（Promiscuous Mode）★核心★
- 正常情况 NIC 只接收"属于自己"的包。
- **抓包器（sniffer）让 NIC 工作方式改变**：把**收到的任何帧都上交 CPU**（不再按目的 MAC 过滤）。
- 这要求机器处于 **混杂模式（promiscuous mode）**。（无线网卡类似的叫 *monitor mode*。）

### 3. 能嗅探到谁的包？
取决于**共享介质**——同一介质上的流量都能被嗅探：
- 共享线缆 / 集线器（hub）/ 共享射频；
- 共享有线（如**有线以太网**）；
- 共享射频（如 **802.11 WiFi**、卫星）。
- 💡 现代**交换式以太网**默认只把帧发往目标口，所以纯被动嗅探有限（需配合 ARP 欺骗等）。

### 4. 普通 socket vs 原始 socket（Raw Socket）★重点★
- **普通 UDP socket 的局限**：
  - 只能收到**发给本机**的包；
  - 应用拿到的 `buf` **只有应用数据**，UDP/IP/Ethernet 头部都被**逐层剥离**了。
  - → 无法嗅探别人的包，也无法**伪造响应包**（因为看不到/控制不了头部）。
- **原始套接字 raw socket** 解决这些问题：
  - **整个以太网帧**（含 **Ether 头 + 完整 IP 包**）直接交给 socket → 应用；
  - 既能看到所有头部，也能**自己拼装任意头部**发送。
- **数据封装回顾**（普通 socket 收包逐层去头）：
  ```
  [Ether|IP|UDP|AppData]  --以太网层处理--> [IP|UDP|AppData]
  --IP层处理--> [UDP|AppData] --传输层处理--> [AppData] --> UDP Socket API
  ```

### 5. Scapy：构造与查看包 ★实操核心★
- VM（seedlab）已预装 scapy；Python 中：`from scapy.all import *`。Scapy **基于 raw socket**。
- **构造各层并用 `/` 叠加**：
  ```python
  ls(IP())                       # 查看 IP 所有字段：src, dst, ttl, id ...
  myip  = IP(src="10.0.2.15")    # 用字段名赋值构造 IP 头
  ls(ICMP())                     # 查看 ICMP 字段
  myicmp = ICMP(id=0x76)         # 默认 ICMP() 是 echo request, type=8
  pkt = myip/myicmp              # 用 "/" 把 ICMP 作为 IP 的负载叠加
  # UDP 类似，可指定 sport, dport
  ```
- **查看包内容**：
  | 命令 | 作用 |
  |---|---|
  | `pkt.show()` | 显示包（不含系统自动填充字段，如 checksum） |
  | `pkt.show2()` | **完整细节**（含计算后的 checksum）——常用 |
  | `pkt.summary()` | 一行摘要 |

### 6. Scapy 嗅探：`sniff()` 参数 + BPF 过滤 ★高频★
```python
pkt = sniff(count=5, iface="enp0s3", prn=print_pkt, filter="icmp")
```
- **`sniff()` 参数**：
  | 参数 | 含义 |
  |---|---|
  | `count` | 抓多少个包，**0 = 无限** |
  | `iface` | 只在指定接口抓 |
  | `prn` | 每抓到一个包的回调，如 `prn=lambda x: x.summary()` |
  | `timeout` | 多少秒后停止（默认 None） |
  | `filter` | **BPF 过滤表达式** |
- **BPF（Berkeley Packet Filter）语法**：
  - **type**：`host`, `net`, `port`, `portrange`
  - **dir**（方向）：`src`, `dst`
  - **proto**（协议）：`ether`, `ip`, `ip6`, `arp`, `tcp`, `udp`
  - **运算符**：`!`/`not`，`&&`/`and`，`||`/`or`
  - 示例：
    - `"ip proto tcp && port 5500"`
    - `"host 10.0.2.6 && port 23"`
    - `"portrange 6000-6008 or net 10.0.2 or dst host 192.168.0.1"`

### 7. 访问包的各层字段
```python
pkts = sniff(filter="icmp")   # pkts 是包列表，pkts[1] 是第 2 个
p = pkts[1]                   # 一个包对象
p[Ether], p[IP], p[ICMP]      # 访问子层；p[IP] 等价 p.getlayer(IP)
ls(p[Ether])                  # 查看 Ether 层字段
p[IP].show()                  # 打印 IP 层（version=4, ihl=5, ttl, proto=icmp, src, dst ...）
```
- ICMP echo：请求 `type=8 (echo-request)`，回复 `type=0 (echo-reply)`。

### 8. 发送：`send()` vs `sendp()` ★必考区分★
| 函数 | 发送层级 | 起始头部 |
|---|---|---|
| **`send(pkt)`** | **网络层（L3）**，`pkt` 是 **IP** 包 | 从 IP 头开始（系统自动加链路层） |
| **`sendp(frame, iface=...)`** | **链路层（L2）**，`frame` 是**帧** | 从 **Ether() 头**开始（自己构造链路头） |
- `send(pkt, iface=, loop=, verbose=)`：`loop=1` 无限发、`0` 发一次；`verbose=1` 显示发送信息、`0` 静默。

### 9. 伪造（Spoofing）与"先嗅探后伪造"
- **伪造 ICMP/UDP**：用 Scapy 把**源地址**改成别人的，构造响应包发出（`icmp_spoof.py`, `udp_spoof.py`）。
  - 例：在 10.0.2.14 起一个 UDP 服务 `nc -lnuvp 5000`，再伪造发往它的 UDP 包。
- **Sniff-then-Spoof（嗅探+伪造组合）**：
  - 监听网络，一旦嗅探到某个请求（如某主机 `ping 8.8.8.8` 的 ICMP echo request），就**抢先伪造一个 echo reply** 发回去（`sniff_spoof_icmp.py`）。
  - 用 **Wireshark** 观察：哪个 reply 来自真实目标、哪个来自我们伪造的程序。

---

## 三、重点回顾
- [ ] 嗅探的本质 = **混杂模式**，NIC 不再按目的 MAC 过滤
- [ ] 普通 socket 只见应用数据；**raw socket** 见/控整个帧
- [ ] Scapy 用 **`/`** 叠层，`show2()` 看完整包
- [ ] `sniff()`: `count=0` 无限、`prn` 回调、`filter` 用 BPF
- [ ] BPF：type/dir/proto + `&& || !`
- [ ] **`send()` 发 IP 包（L3）；`sendp()` 发帧（L2）**
- [ ] 先嗅探后伪造的攻击思路

---

## 四、自测题
1. 嗅探需要网卡处于什么模式？→ **混杂模式（promiscuous mode）**
2. 为什么伪造响应包要用 raw socket？→ 普通 socket 收到的 `buf` **已剥离各层头部**，且只收发给本机的包；raw socket 能拿到/构造**完整帧头部**。
3. `send()` 与 `sendp()` 区别？→ `send()` 发**IP 包(L3)**，`sendp()` 发**链路层帧(L2，从 Ether 开始)**。
4. BPF 过滤 `"host 10.0.2.6 && port 23"` 含义？→ 抓与主机 10.0.2.6 且端口 23（telnet）相关的包。
5. `sniff(count=0)` 表示？→ **无限抓包**。

---
🔗 相关：[[L03-TCP-IP-III]]（MAC/帧基础）· [[L06-PKI-TLS]] · [[review-README]]
