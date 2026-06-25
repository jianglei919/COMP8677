# COMP8677 — 复习资料总览（Networking & Data Security）

按 `lectures/` 下每节 Lecture 课件整理的 Markdown 复习笔记。每份含：知识点提纲 · 核心概念详解 · 重点/易考点 · 自测题(MCQ仿真) · 常见易错点。

---

## 📅 期中考试信息（来自 Brightspace 公告）
- **时间**：**6月26日（周五）13:00–14:00**
- **地点**：4011（本班教室），Ouellette 300
- **形式**：**60 道选择题（MCQ）/ 1 小时**
- **范围**：**前三周 PPT + 作业（assignment）**
- **⛔ 明确不考任何 security 讲座**（"No security lectures will be included"）
- **🚫 不准用任何电子设备，包括计算器** → 子网/幂运算要会**心算**！

> ⚠️ 注意：`assignments/` 目录目前为空。**作业也在考试范围内**，请把作业题发我，可一并整理。

---

## 📚 六节笔记导航

| # | 笔记 | 主题 | 期中范围 |
|---|---|---|---|
| 01 | [L01 — TCP/IP-I](L01-TCP-IP-I.md) | Internet概念、接入网、**5层协议模型**、HTTP、DNS | ✅ **考** |
| 02 | [L02 — TCP/IP-II](L02-TCP-IP-II.md) | **TCP/UDP**、多路复用分解、流量控制、**IP编址/子网**、DHCP | ✅ **考**（重灾区）|
| 03 | [L03 — TCP/IP-III](L03-TCP-IP-III.md) | IPv6、路由、链路层、**MAC/ARP**、**交换机自学习/泛洪** | ✅ **考** |
| 04 | [L04 — Sniffing & Spoofing](L04-Sniffing-Spoofing.md) | 混杂模式、raw socket、**Scapy** 嗅探与伪造 | ⛔ 不考 |
| 05 | [L05 — Cryptography](L05-Cryptography.md) | 哈希、**RSA**、数字签名、**AES/ECB/CBC**、DH | ⛔ 不考 |
| 06 | [L06 — PKI & TLS](L06-PKI-TLS.md) | 证书/CA、证书链、**TLS 握手与三性质** | ⛔ 不考 |

👉 **期中只需主攻 01–03**。冲刺前看一页：[**期中速记 Midterm-CramSheet**](Midterm-CramSheet.md)

---

## 📝 官方样题（公告给出，含答案）

| # | 题目 | 答案 | 对应笔记 |
|---|---|---|---|
| 1 | 无线接入点(wireless access point)的作用 | **B. 提供无线链路** | L01 接入网 |
| 2 | 子网 `233.1.1.0/24` 中 IP 的共同位数 | **A. 24 位** | L02 子网 |
| 3 | 链路层的分组叫什么 | **A. frame（帧）** | L01/L03 |
| 4 | 传输层 UDP 多路分解需要的信息 | **A. 只需目的端口** | L02 mux/demux |
| 5 | SYN 包 seq=123，同一发送方那个 ACK 包 seq | **B. 124** | L02 三次握手 |
| 6 | 交换机收到目的 MAC 不在转发表中的帧 | **C. 泛洪到除入口外所有接口** | L03 交换机 |

> 这 6 道全部落在 **L01–L03**，且都是"定义/数值/分层"类的客观题——复习时重点抓**确定性事实**（哪一层、多少位、什么字段、什么动作）。

---

## 🎯 期中高频考点速查（01–03）
- **5 层模型**每层的功能 / 协议 / PDU 名称（message·segment·datagram·**frame**·bit）
- **TCP vs UDP** 全面对比；两者都**不**保证延迟/带宽
- **UDP 分解**只看目的端口；**TCP 分解**看 4 元组
- **子网 /x**：共同位=x；主机位=32−x；地址数=2^(32−x)
- **TCP 三次握手**序列号（SYN seq=x → 下一包 x+1）
- **流量控制**用 `receive_window`，防接收缓冲区溢出
- **转发(本地)** vs **路由(全局)**
- **交换机**：未知目的 MAC → **泛洪**；自学习建表；ARP 是主机做 IP→MAC
- **MAC 48位/十六进制**；**IP 32位**；跨子网 **IP 不变、MAC 逐跳变**

---

## 🛠 这些笔记怎么来的
- `.ppt`（旧版，L01–03）与 `.pptx`（L04–06）课件经脚本抽取正文，再结合课程教材
  （Kurose & Ross《Computer Networking: A Top-Down Approach》第4版 + SEED Lab 安全材料）整理。
- 内容已对齐**本课程老师 Shaoquan Jiang 的具体讲法**与官方样题口径。

## 💡 使用建议
1. 先读 [Midterm-CramSheet](Midterm-CramSheet.md) 把握全局与必背点；
2. 逐课过 L01→L02→L03，做每节末尾的**自测题**；
3. 重点演练 **子网计算**和 **TCP 握手序列号**（考场无计算器，靠心算）；
4. 把作业题发我 → 补一份"作业重点"笔记。
