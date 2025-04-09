import { Relay } from 'nostr-tools/relay';
import 'websocket-polyfill';
import * as utils from './utils.js';

/**
 * 订阅并接收消息
 * @param {Function} onMessageCallback 收到消息时的回调函数
 * @param {Object} options 订阅选项
 * @param {string} options.recipient 接收者公钥，默认使用配置的接收者
 * @param {number} options.since 从何时开始接收消息，默认为当前时间
 * @param {string} options.subject 订阅特定主题，默认为所有主题
 * @returns {Object} 包含断开连接方法的对象
 */
async function subscribeMessages(onMessageCallback, options = {}) {
  // 获取配置
  const recipient = options.recipient || utils.getRecipientPublicKey();
  const relayUrl = utils.getRelayUrl();
  const since = options.since || Math.floor(Date.now() / 1000);
  
  console.log(`开始监听中继服务器: ${relayUrl}`);
  console.log(`接收者: ${recipient}`);
  console.log(`从时间: ${new Date(since * 1000).toLocaleString()}`);
  
  try {
    // 初始化中继连接
    const relay = await Relay.connect(relayUrl);
    console.log(`已连接到 ${relay.url}`);
    
    // 构建过滤器
    const filter = {
      kinds: [1573], // DePHY 消息层指定的类型
      since: since,
      "#p": [recipient], // 订阅特定接收者的消息
    };
    
    // 如果指定了主题，则过滤主题
    if (options.subject) {
      filter["#s"] = [options.subject];
      console.log(`仅订阅主题: ${options.subject}`);
    }
    
    // 订阅消息
    const sub = relay.sub([filter]);
    
    sub.on('event', async (event) => {
      try {
        console.log('收到新消息:', {
          id: event.id,
          pubkey: event.pubkey,
          created_at: new Date(event.created_at * 1000).toLocaleString(),
          tags: event.tags
        });
        
        // 解析消息内容
        let parsedContent;
        try {
          parsedContent = JSON.parse(event.content);
        } catch (e) {
          parsedContent = event.content;
        }
        
        // 调用回调函数
        if (typeof onMessageCallback === 'function') {
          onMessageCallback(event, parsedContent);
        }
      } catch (error) {
        console.error('处理消息时出错:', error);
      }
    });
    
    sub.on('eose', () => {
      console.log('EOSE: 存储的事件传输完毕，开始接收实时事件');
    });
    
    // 返回包含断开连接方法的对象
    return {
      disconnect: () => {
        sub.unsub();
        relay.close();
        console.log('已断开连接');
      }
    };
  } catch (error) {
    console.error('订阅消息时出错:', error);
    throw error;
  }
}

// 如果直接运行此文件，启动测试订阅
if (import.meta.url === `file://${process.argv[1]}`) {
  subscribeMessages((event, content) => {
    console.log('收到消息内容:', content);
  })
    .then(subscription => {
      console.log('订阅已启动，按 Ctrl+C 停止...');
      
      // 添加进程退出处理
      process.on('SIGINT', () => {
        console.log('正在断开连接...');
        subscription.disconnect();
        process.exit(0);
      });
    })
    .catch(error => {
      console.error('订阅出错:', error);
      process.exit(1);
    });
}

export { subscribeMessages };