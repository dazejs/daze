/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import cluster from 'cluster'
import debuger from 'debug'
import net from 'net'
import http from 'http'
import {
  RELOAD_SIGNAL, WORKER_DYING, WORKER_DID_FORKED, WORKER_DISCONNECT, STIKCY_CONNECTION
} from './const'
import { Deferred } from '../foundation/support/defered'

const debug = debuger('daze-framework:cluster')

export interface IWorkerOptions {
  port: number,
  sticky: boolean,
  createServer: (...args: any[]) => http.Server
}

const defaultOptions = {
  port: 0,
  sticky: false,
  createServer: () => {},
};

/**
 * @class
 */
export class Worker {
  /**
   * worker options
   */
  options: IWorkerOptions;

  /**
   * worker server
   */
  server: net.Server;

  constructor(opts: IWorkerOptions) {
    this.options = Object.assign({}, defaultOptions, opts);
  }

  // disconnect worker
  disconnect(refork = true) {
    const { worker } = cluster;
    if (Reflect.getMetadata(WORKER_DYING, worker)) return
    Reflect.defineMetadata(WORKER_DYING, true, worker)
    debug('worker disconnect');
    if (refork) {
      // You need to re-fork the new work process
      // 需要重新 fork 新的工作进程
      // Send notification to the main process: the work process is closing
      // 给主进程发送通知：工作进程即将关闭
      worker.send(WORKER_DISCONNECT);
      // The daze-did-fork, which is sent back by the main process
      // indicates that a new work process has been forked
      // and that the current process can be closed
      // 然后接收主进程发送回来的 daze-did-fork 表示已 fork 了一个新的工作进程，当前进程可以关闭了
      worker.once('message', (message: string) => {
        if (message === WORKER_DID_FORKED) {
          this.close();
        }
      });
    } else {
      // Instead of having to fork the new work process, close the service directly
      // 不需要重新 fork 新的工作进程，直接关闭服务
      this.close();
    }
  }

  close() {
    // Close the process timeout
    // 关闭进程超时时间
    let timer: NodeJS.Timeout;
    const killTimeout = 10 * 1000;
    if (killTimeout > 0) {
      timer = setTimeout(() => {
        debug(`process exit by killed(timeout: ${killTimeout}ms), pid: ${process.pid}`);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
      }, killTimeout);
    }
    const { worker } = cluster;
    debug((`start close server, pid: ${process.pid}`));
    this.server.close(() => {
      debug(`server closed, pid: ${process.pid}`);
      try {
        worker.disconnect();
        clearTimeout(timer);
      } catch (e) {
        debug(`already disconnect, pid:${process.pid}`);
      }
    });
  }

  catcheReloadSignal() {
    process.on('message', (message) => {
      if (message !== RELOAD_SIGNAL) return;
      this.disconnect(true);
    });
  }

  /**
   * Start the service
   * 启动服务
   */
  async run() {
    const deferred = new Deferred<any>();
    this.catcheReloadSignal();
    if (!this.options.sticky) {
      this.server = this.options.createServer(this.options.port, () => {
        deferred.resolve();
      });
      this.server.on('connection', () => {
        debug(`Request handled by worker: ${process.pid}`);
      });
    } else {
      process.on('message', (message, connection) => {
        if (message !== STIKCY_CONNECTION) return;
        debug('WORKER #%d  got conn from %s', process.pid, connection.remoteAddress);
        // emulate a connection event on the server by emitting the
        // event with the connection master sent to us
        // 通过使用发送给我们的连接主发送事件，模拟服务器上的连接事件
        this.server.emit('connection', connection);
        // resume as we already caught the conn
        // 从一个暂停的套接字开始读数据
        connection.resume();
      });
      this.server = this.options.createServer(0, 'localhost', () => {
        deferred.resolve();
      });
    }
    return deferred.promise;
  }
}