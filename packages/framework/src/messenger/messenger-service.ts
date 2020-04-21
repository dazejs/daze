/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import cluster from 'cluster';
import { EventEmitter } from 'events';
import { Config } from '../config';
import { Container } from '../container';
import { getAlivedWorkers } from '../cluster/helpers';
import { Application } from '../foundation/application';

const MESSENGER = 'daze-messenger';


type MessageType = 'all' | 'worker' | 'agent'

interface MessageData {
  action: string;
  channel: string;
  data: any;
  type: MessageType;
}

export class MessengerService extends EventEmitter {

  app: Application = Container.get('app');

  config: Config = Container.get('config');

  events: Function;

  constructor() {
    super();
    this.setMaxListeners(100);
    this.events = this.config.get('messenger', () => {
      //
    }) as Function;
    this.run();
    this.parseEvents();
  }

  // 解析用户配置事件
  parseEvents() {
    this.events(this);
  }

  // 生成进程间通信（IPC）内置通信数据格式
  getMessage(channel: string, data: any, type: MessageType = 'all'): MessageData {
    return {
      action: MESSENGER,
      channel,
      data,
      type,
    };
  }

  /**
   * 广播给所有工作进程，包括当前进程
   * @param channel 
   * @param data 
   * @param type 
   */
  broadcast(channel: string, data: any, type?: MessageType) {
    const message = this.getMessage(channel, data, type);
    process.send?.(message);
  }

  /**
   * broadcast to agent
   * @param channel 
   * @param data 
   */
  broadcastToAgent(channel: string, data: any) {
    return this.broadcast(channel, data, 'agent');
  }

  /**
   * broadcast to worker (ex agent)
   * @param channel 
   * @param data 
   */
  broadcastToWorker(channel: string, data: any) {
    return this.broadcast(channel, data, 'worker');
  }


  /**
   * 启动
   */
  run() {
    if (cluster.isMaster) { // 主进程
      // 主进程监听工作进程发送的消息事件
      cluster.on('message', (_worker, message) => {
        // 不处理 Messenger 以外的通信数据
        if (!message || message.action !== MESSENGER) return;
        if (message.type === 'all') { // 广播到所有工作进程
          // 获取所有存活的工作进程
          const workers = getAlivedWorkers();
          // 给所有工作进程发送消息
          for (const worker of workers) {
            worker.send(message);
          }
        } else if (message.type === 'worker') { // 广播到所有业务工作进程
          const workers = this.app.getWorkers() ?? [];
          for (const worker of workers) {
            worker?.send(message);
          }
        } else if (message.type === 'agent') { // 广播到所有 agent 工作进程
          const agent = this.app.getAgent();
          agent?.send(message);
        }
      });
    } else { // 工作进程
      // 工作进程监听主进程发送的消息事件
      process.on('message', (message) => {
        // 不处理 Messenger 以外的通信数据
        if (!message || message.action !== MESSENGER) return;
        this.emit(message.channel, message.data);
      });
    }
  }
}
