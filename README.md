# DePHY Messaging Layer Integration Example

This is a sample project demonstrating message publishing and subscription using the DePHY messaging layer. The DePHY messaging layer is a decentralized communication network based on the NoStr protocol, designed for communication between devices and software.

## Features

- Decentralized federated network based on the NoStr protocol
- Acts as a message queue, supporting the publish/subscribe programming model
- Designed specifically for decentralized device and software communication
- Supports Web3-friendly billing and metering
- Provides an HTTP API for easy message sending

## Project Structure
dephy-messaging-project/
├── .env # Configuration file (keys and URLs)
├── package.json # Project information and dependencies
├── README.md # Project description
└── src/
├── index.js # Main application entry point
├── publish.js # Message publishing module
├── subscribe.js # Message subscription module
└── utils.js # Common utility functions

## Installation

```bash
# Clone the project
git clone <repository-url> dephy-messaging-project
cd dephy-messaging-project

# Install dependencies
pnpm install

# Sender's private key (optional, will be auto-generated if not provided)
SENDER_SECRET_KEY=your_secret_key_hex

# Recipient's public key
RECIPIENT_PUBLIC_KEY=recipient_public_key_hex

# Relay server URL
RELAY_URL=https://dev-relay.dephy.dev

Usage
Run the Example Application

node src/publish.js


# DePHY 消息层集成示例

这是一个基于DePHY消息层的消息发布与订阅示例项目。DePHY消息层是一个基于NoStr协议的去中心化通信网络，用于设备和软件之间的通信。

## 特点

- 基于NoStr协议的联合去中心化网络
- 作为消息队列，支持发布/订阅编程模型
- 专为去中心化设备和软件通信设计
- 支持Web3友好的计费和计量
- 提供HTTP API用于轻松发送消息

## 项目结构

```
dephy-messaging-project/
├── .env                 # 配置文件（密钥和URL）
├── package.json         # 项目信息和依赖
├── README.md            # 项目说明
└── src/
    ├── index.js         # 主应用入口
    ├── publish.js       # 消息发布模块
    ├── subscribe.js     # 消息订阅模块
    └── utils.js         # 公共实用工具函数
```

## 安装

```bash
# 克隆项目
git clone <repository-url> dephy-messaging-project
cd dephy-messaging-project

# 安装依赖
pnpm install
```

## 配置

编辑 `.env` 文件，设置以下配置：

```
# 发送者私钥（可选，如不设置将自动生成）
SENDER_SECRET_KEY=your_secret_key_hex

# 接收者公钥
RECIPIENT_PUBLIC_KEY=recipient_public_key_hex

# 中继服务器URL
RELAY_URL=https://dev-relay.dephy.dev
```

## 使用方法

### 运行示例应用

```bash
node src/index.js
```

这将启动一个完整的示例，演示消息的发布和订阅过程。

### 单独发布消息

```bash
node src/publish.js
```

### 单独订阅消息

```bash
node src/subscribe.js
```

## 在自己的代码中使用

### 发布消息

```javascript
const { publishMessage } = require('./src/publish');

// 发布消息
publishMessage({
  type: 'example',
  message: 'Hello DePHY!',
  timestamp: new Date().toISOString()
}).then(result => {
  console.log('发送结果:', result);
});
```

### 订阅消息

```javascript
const { subscribeMessages } = require('./src/subscribe');

// 订阅消息
subscribeMessages((event, content) => {
  console.log('收到消息:', content);
}, {
  // 可选参数
  // recipient: '特定接收者公钥',
  // since: 特定时间戳,
  // subject: '特定主题'
}).then(subscription => {
  // 保存subscription对象，用于之后断开连接
  // 断开连接: subscription.disconnect();
});
```

## NoStr 事件格式

DePHY消息层只接受kind为1573的消息：

```json
{
  "kind": 1573,
  "created_at": 1742052212,
  "tags": [
    ["s", "0"],
    ["p", "6f7bb11c04d792784c9dfcb4246e9afc0d6a7eae549531c2fce51adf09b2887e"]
  ],
  "content": "消息内容",
  "pubkey": "8275a3b63fcf95d195121eb7703df11a8955cfdc39c2b79b83fae5c88cfdb52d",
  "id": "b9189e364839a682f2bb9d163d49a6d2dcb9dc49513424a7da5074f62b10a459",
  "sig": "616d5dc06417d455a04ac7bf388bd415b58afbdfcf5a4f5043f51c8578bb3b5dc556d2cf9161bcd04bf926d235fd731df69cae595fe64ff3e5944c41e0007b73"
}
```

## 相关链接

- [NoStr协议基础](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [DePHY消息浏览器](https://dephy-node-nostr-explorer.pages.dev/relay/dev-relay.dephy.dev)

## 许可证

MIT