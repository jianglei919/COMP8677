# Lecture 01 — TCP/IP-I（网络概论 / 应用层入门）

> 📘 源文件：`lectures/Lecture - 01 - TCP_IP-I.ppt`（Kurose & Ross《自顶向下方法》第1章 + 第2章应用层）
> ✅ **期中范围（前三周 PPT）** — 重点复习
> 🎯 考试形式：60道选择题 / 1小时 / 不准用计算器

---

## 一句话概览
互联网是"网络的网络"，靠**分层协议栈**把复杂功能拆开；本节讲清楚 **Internet 是什么、网络边缘/接入网、5层协议模型、HTTP/Web、DNS**。

---

## 一、知识点提纲
1. 什么是 Internet（nuts-and-bolts 视角 / 服务视角）
2. 网络边缘（end systems）与网络核心（路由器、分组交换）
3. 接入网（有线/无线/蜂窝）
4. 协议分层：5层 Internet 协议栈
5. 封装（encapsulation）
6. 应用层：HTTP 与 Web
7. 应用层：DNS（域名解析）

---

## 二、核心概念详解

### 1. 什么是 Internet
- **Nuts-and-bolts 视角**：由数十亿**端系统/主机（hosts/end systems）**、**路由器/交换机**、**通信链路**组成的"**network of networks（网络的网络）**"。
- **服务视角**：为分布式应用提供服务——Web、流媒体视频、视频会议、email、游戏、电商、社交媒体。
- **协议（protocol）**：定义了报文的**格式、顺序**，以及收发报文时采取的**动作**。👉 *"协议"是网络一切通信的核心概念。*

### 2. 网络边缘 vs 网络核心
| | 网络边缘 | 网络核心 |
|---|---|---|
| 组成 | 端系统（主机）：客户端 + 服务器 | 互连的路由器 |
| 角色 | 运行应用程序 | 转发分组（packets） |
| 关键机制 | 接入网 | **分组交换 packet switching** |

- **分组交换 vs 电路交换**：互联网用**分组交换**（数据切成分组，存储转发 store-and-forward，链路按需共享）；传统电话用**电路交换**（提前预留带宽/资源）。

### 3. 接入网（Access Networks）
- **有线**：电缆（HFC）、DSL、以太网。
- **无线 WLAN**：共享无线接入网通过 **基站（base station）/ 无线接入点（access point, AP）** 把端系统连到路由器。
  - ⭐ **样题1**：无线接入点（wireless access point）的作用 = **提供无线链路（providing a wireless link）**。
- **广域无线**：由电信（蜂窝 cellular）运营商提供（4G/5G）。

### 4. 协议分层：5层 Internet 协议栈（★必背★）
从上到下：

| 层 | 英文 | 功能 | 典型协议 | 数据单元(PDU) |
|---|---|---|---|---|
| 应用层 | Application | 支持网络应用 | **FTP, SMTP, HTTP, DNS** | message（报文） |
| 传输层 | Transport | 进程到进程的数据传输 | **TCP, UDP** | segment（段） |
| 网络层 | Network | 源到目的的**数据报路由** | **IP**, 路由协议 | datagram（数据报） |
| 链路层 | Link | 相邻网络元素间的数据传输 | **Ethernet, 802.11(WiFi), PPP** | **frame（帧）** |
| 物理层 | Physical | 在线缆/介质上传送比特 | — | bit（比特） |

- 记忆口诀：**应-传-网-链-物** / **A-T-N-L-P**。
- ⭐ **样题3**：链路层的分组叫 **frame（帧）**。（段=传输层，数据报=网络层，payload=载荷不是层级单位）
- ⚠️ 易混：**TCP/IP 4层模型**把"链路+物理"合成一层叫"网络接口层"；OSI 是7层（多了会话层 Session、表示层 Presentation）。

### 5. 封装（Encapsulation）
数据自顶向下逐层加头部：
```
应用报文 M
→ 传输层加头: [Ht | M]            (segment)
→ 网络层加头: [Hn | Ht | M]       (datagram)
→ 链路层加头: [Hl | Hn | Ht | M]  (frame)
→ 物理层: 比特流
```
接收端自底向上逐层**解封装（去头）**。

### 6. 应用层：HTTP 与 Web
- **HTTP = HyperText Transfer Protocol**，Web 的应用层协议，采用 **client/server 模型**。
  - **客户端**：浏览器，请求、接收并显示 Web 对象。
  - **服务器**：Web 服务器，响应请求发送对象。
- **Web 页面**：由一个**基础 HTML 文件** + 若干**对象（objects）**组成；对象可以是另一个 HTML 文件、JPEG 图片、Java applet、音频文件等。
- 每个对象由一个 **URL** 寻址，例如 `www.someschool.edu/pic.gif`。
- HTTP 跑在 **TCP** 之上（端口 **80**）。

### 7. 应用层：DNS（域名系统）
**作用**：把人类可读的**主机名（hostname）** ↔ **IP 地址（32 位）** 互相转换。

- 标识符对比：人有 SSN/姓名/护照号；Internet 主机/路由器有 **IP 地址（32 bit）** 用于给数据报寻址；`www.yahoo.com` 这种名字给人用。
- **DNS 层级结构（树状）**：
  ```
  ROOT（根，记作 ".")
    └─ TLD 顶级域（.com, .ca, .net, .org …）
         └─ 二级域 second-level（分配给具体机构，如 uwindsor.ca）
              └─ 权威 DNS 服务器 authoritative
  ```
- **解析过程**（迭代查询示例）：查询从 **ROOT 服务器**开始 → 它不知道就返回 **.NET（TLD）名字服务器**的 IP → TLD 服务器再指向下一级 → 最终**权威 DNS 服务器**给出答案。
- **URL 结构**：`http://hostname/path`
  - hostname = 服务器的网络位置（对应 IP 地址）
  - path = 服务器上文件所在目录（如 `/var/www/html` 是默认网站根目录）。

---

## 三、重点 / 易考点（MCQ 视角）
- [ ] 5层协议栈每层**功能 + 协议 + PDU 名称**（必考，多角度问）
- [ ] 各层 PDU：message / segment / datagram / **frame** / bit
- [ ] 接入点 AP 的作用 = 提供无线链路
- [ ] 分组交换 vs 电路交换的区别
- [ ] DNS 是把名字 ↔ IP；解析从 ROOT 开始
- [ ] IP 地址是 **32 位**
- [ ] HTTP 是应用层、client/server、跑在 TCP/80
- [ ] 封装：每下一层加自己的头部

---

## 四、自测题（MCQ 仿真）
1. 链路层的分组（packet）称为？
   A. segment　B. datagram　C. **frame** ✅　D. payload
2. 下列哪个协议属于**传输层**？
   A. HTTP　B. **TCP** ✅　C. IP　D. Ethernet
3. 无线接入点（access point）的主要作用是？
   A. routing　B. **提供无线链路** ✅　C. 提供有线链路　D. 调制
4. IP 地址的长度是？
   A. 16 位　B. **32 位** ✅　C. 48 位　D. 64 位
5. DNS 的主要功能是？
   A. 加密数据　B. **主机名↔IP 地址转换** ✅　C. 路由选择　D. 拥塞控制
6. 网络层的数据单元（PDU）叫？
   A. frame　B. segment　C. **datagram** ✅　D. message

> 💡 **答案与解析**：1-C（链路层=帧）；2-B（HTTP/DNS 是应用层，IP 是网络层，Ethernet 是链路层）；3-B；4-B（IPv4=32位，IPv6=128位）；5-B；6-C。

---

## 五、常见易错点
- ❌ 把 **48 位 MAC 地址** 和 **32 位 IP 地址** 搞混。
- ❌ 把"segment/datagram/frame"对应的层弄反 → 记：**传输=段，网络=数据报，链路=帧**。
- ❌ 以为 HTTP 在传输层 → HTTP 是**应用层**，**TCP** 才是传输层。
- ❌ 以为 DNS 解析从权威服务器开始 → 从 **ROOT** 开始逐级向下。

---
🔗 相关：[[L02-TCP-IP-II]]（传输层与网络层）、[[review-README]]（总览与期中范围）
