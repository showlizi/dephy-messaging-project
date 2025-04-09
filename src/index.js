import { publishMessage } from './publish.js';
import { subscribeMessages } from './subscribe.js';
import * as utils from './utils.js';

/**
 * 主应用示例
 * 该示例展示了如何使用DePHY消息层进行消息的发布和订阅
 */
async function main() {
  try {
    // 获取发送者身份信息
    const secretKey = utils.getSenderSecretKey();
    const publicKey = utils.getSenderPublicKey(secretKey);
    
    console.log('=== DePHY 消息层示例应用 ===');
    console.log(`发送者公钥: ${publicKey}`);
    console.log(`接收者公钥: ${utils.getRecipientPublicKey()}`);
    console.log(`中继服务器: ${utils.getRelayUrl()}`);
    console.log('===========================');
    
    // 启动消息订阅
    console.log('\n[1] 启动消息订阅...');
    const subscription = await subscribeMessages((event, content) => {
      console.log('\n收到新消息:');
      console.log('- 发送者:', event.pubkey);
      console.log('- 时间:', new Date(event.created_at * 1000).toLocaleString());
      console.log('- 内容:', typeof content === 'object' ? JSON.stringify(content, null, 2) : content);
    });
    
    // 发送一条测试消息
    console.log('\n[2] 发送测试消息...');
    const messageContent = {
      type: 'greeting',
      text: '你好，DePHY消息层！',
      timestamp: new Date().toISOString(),
      from: publicKey
    };
    
    const result = await publishMessage(messageContent);
    
    if (result.success) {
      console.log('消息已成功发送！');
      console.log('消息ID:', result.event.id);
      
      // 等待几秒钟，以便接收消息
      console.log('\n[3] 等待接收消息...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 发送第二条消息
      console.log('\n[4] 发送第二条消息...');
      const secondMessage = {
        type: 'update',
        text: '这是一条更新消息',
        timestamp: new Date().toISOString(),
        counter: 42
      };
      
      await publishMessage(secondMessage);
      
      // 再等待几秒钟
      console.log('\n[5] 再次等待接收消息...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.error('发送消息失败:', result.error);
    }
    
    // 断开连接
    console.log('\n[6] 断开连接...');
    subscription.disconnect();
    console.log('示例运行完毕！');
    
  } catch (error) {
    console.error('运行示例时出错:', error);
  }
}

// 如果直接运行此文件，启动主应用
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('主应用出错:', error);
      process.exit(1);
    });
}

export { main };