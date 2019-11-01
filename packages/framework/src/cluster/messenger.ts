/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import EventEmitter from 'events';
import cluster from 'cluster';
import { getAlivedWorkers } from './helpers';
import { Container } from '../container';
import { Config } from '../config';

const MESSENGER = 'daze-messenger';

interface MessageData {
  action: string;
  channel: string;
  data: any;
  type: string | boolean;
}

export class Messenger extends EventEmitter {

  config: Config = Container.get('config');

  events: any;

  constructor() {
    super();
    this.events = this.config.get('messenger', () => {});
    this.run();
    this.parseEvents();
  }

  // 解析用户配置事件
  parseEvents() {
    this.events(this);
  }

  // 生成进程间通信（IPC）内置通信数据格式
  getMessage(channel: string, data: any, type: string | boolean = 'broadcast'): MessageData {
    return {
      action: MESSENGER,
      channel,
      data,
      type,
    };
  }

  // 广播给所有工作进程，包括当前进程
  broadcast(channel: string, data: any) {
    const message = this.getMessage(channel, data, false);
    process.send && process.send(message);
  }

  run() {
    if (cluster.isMaster) { // 主进程
      // 主进程监听工作进程发送的消息事件
      cluster.on('message', (_worker, message) => {
        // 不处理 Messenger 以外的通信数据
        if (!message || message.action !== MESSENGER) return;
        if (message.type === 'broadcast') {
          // 获取所有存活的工作进程
          const workers = getAlivedWorkers();
          // 给所有工作进程发送消息
          for (const worker of workers) {
            worker.send(message);
          }
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
