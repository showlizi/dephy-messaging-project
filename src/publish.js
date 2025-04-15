import { finalizeEvent } from 'nostr-tools';
import 'websocket-polyfill';
import * as utils from './utils.js';

/**
 * 创建并发布一条消息
 * @param {Object|string} content 消息内容
 * @param {string} subject 主题标识符，用于区分对话
 * @returns {Promise<Object>} 发布结果
 */
async function publishMessage(content, subject = '0') {
  // 获取配置
  const senderSecretKey = utils.getSenderSecretKey();
  const recipient = utils.getRecipientPublicKey();
  const relayUrl = utils.getRelayUrl();
  
  // 将内容转为字符串
  const contentStr = typeof content === 'string' 
    ? content 
    : JSON.stringify(content);
  
  try {
    // 创建事件
    const event = finalizeEvent({
      kind: 1573, // DePHY 消息层指定的类型
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["s", subject], // 主题标识符
        ["p", recipient] // 接收者公钥
      ],
      content: contentStr,
    }, senderSecretKey);
    
    console.log('准备发送消息:', {
      id: event.id,
      pubkey: event.pubkey,
      recipient: recipient,
      subject: subject,
      content: contentStr.length > 100 ? contentStr.substring(0, 100) + '...' : contentStr
    });
    
    // 使用HTTP API发送事件 (HTTP方式可能更可靠)
    const response = await fetch(`${relayUrl.replace('wss://', 'https://')}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    // 处理响应
    const responseText = await response.text();
    
    if (response.status === 200) {
      console.log('消息发送成功:', responseText);
      return { success: true, message: responseText, event };
    } else {
      console.error('消息发送失败:', response.status, responseText);
      return { success: false, error: responseText, status: response.status };
    }
  } catch (error) {
    console.error('发送消息时出错:', error.message);
    return { success: false, error: error.message };
  }
}

// 如果直接运行此文件，发送一条测试消息
if (import.meta.url === `file://${process.argv[1]}`) {
  const testMessage = {
    type: 'test',
    message: 'Hello DePHY Messaging Layer!',
    timestamp: new Date().toISOString()
  };
  
  publishMessage(testMessage)
    .then(result => {
      if (result.success) {
        console.log('测试消息发送成功');
      } else {
        console.log('测试消息发送失败');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('测试出错:', error);
      process.exit(1);
    });
}

export { publishMessage };