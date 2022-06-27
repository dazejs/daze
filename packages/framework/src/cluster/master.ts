/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import cluster from 'cluster';
import debuger from 'debug';
import * as net from 'net';
import hash from 'string-hash';
import { Deferred } from '../foundation/support/defered';
import { RELOAD_SIGNAL, STIKCY_CONNECTION, WORKER_DID_FORKED, WORKER_DISCONNECT, WORKER_DYING, DAZE_PROCESS_TYPE } from './const';
import { getAlivedWorkers, parseMasterOpts } from './helpers';
import { Application } from '../foundation/application';

const debug = debuger('daze-framework:cluster');

export interface MasterOptions {
  port: number;
  workers: number;
  sticky: boolean;
}

const defaultOptions: MasterOptions = {
  port: 0,
  workers: 0,
  sticky: false,
};


export class Master {

  /**
   * master options
   */
  options: MasterOptions;

  /**
   * server connections
   */
  connections: {
    [key: string]: net.Socket;
  } = {};

  app: Application;

  constructor(app: Application, opts: MasterOptions) {
    this.app = app;
    this.options = Object.assign({}, defaultOptions, parseMasterOpts(opts));
  }

  /**
   * Fork a work process
   */
  forkWorker(env = {}) {
    const worker = cluster.fork(env);
    (worker as any)[DAZE_PROCESS_TYPE] = 'worker';
    debug(`worker is forked, use pid: ${worker.process.pid}`);
    const deferred = new Deferred<cluster.Worker>();
    // Accepts the disconnection service signal sent by the work process,
    // indicating that the work process is about to
    // stop the service and needs to be replaced by a new work process
    // 接受工作进程发送的断开服务信号，表示该工作进程即将停止服务，需要 fork 一个新的工作进程来替代
    worker.on('message', (message: string) => {
      if (Reflect.getMetadata(WORKER_DYING, worker)) return;
      // if (worker[WORKER_DYING]) return;
      if (message === WORKER_DISCONNECT) {
        debug('refork worker, receive message \'daze-worker-disconnect\'');
        Reflect.defineMetadata(WORKER_DYING, true, worker);
        // worker[WORKER_DYING] = true;
        // The signal that tells the worker process that it has fork after fork,
        // and lets it end the service
        // fork 完毕后通知工作进程已 fork 的信号，让其结束服务
        this.forkWorker(env).then(() => worker.send(WORKER_DID_FORKED)).catch(() => {
          //
        });
      }
    });
    // Emitted after the worker IPC channel has disconnected
    // Automatically fork a new work process after the IPC pipeline is detected to be disconnected
    worker.once('disconnect', () => {
      if (Reflect.getMetadata(WORKER_DYING, worker)) return;
      // if (worker[WORKER_DYING]) return;
      debug(`worker disconnect: ${worker.process.pid}`);
      Reflect.defineMetadata(WORKER_DYING, true, worker);
      // worker[WORKER_DYING] = true;
      debug('worker will fork');
      this.forkWorker(env);
    });
    // The cluster module will trigger an 'exit' event when any worker process is closed
    worker.once('exit', (code: number, signal: string) => {
      // if (worker[WORKER_DYING]) return;
      if (Reflect.getMetadata(WORKER_DYING, worker)) return;
      debug(`worker exit, code: ${code}, signal: ${signal}`);
      Reflect.defineMetadata(WORKER_DYING, true, worker);
      // worker[WORKER_DYING] = true;
      this.forkWorker(env);
    });
    // listening event
    worker.once('listening', (address: string) => {
      debug(`listening, address: ${JSON.stringify(address)}`);
      deferred.resolve(worker);
    });

    return deferred.promise;
  }

  /**
   * Work processes corresponding to the fork, depending on the configuration or number of cpus
   * fork 对应的工作进程，取决于cpu的数量或配置参数
   */
  forkWorkers() {
    const { workers } = this.options;
    const promises: Promise<any>[] = [];
    const env = {
      DAZE_PROCESS_TYPE: 'worker'
    };
    for (let i = 0; i < workers; i += 1) {
      promises.push(this.forkWorker(env));
    }
    return Promise.all(promises);
  }

  /**
   * Fork a separate process
   * fork 一条独立进程
   */
  forkAgent() {
    const env = {
      DAZE_PROCESS_TYPE: 'agent'
    };
    const agent = cluster.fork(env);
    (agent as any)[DAZE_PROCESS_TYPE] = 'agent';
    debug(`agent is forked, use pid: ${agent.process.pid}`);
    return agent;
  }

  /**
   * Create sticky sessions for websocket communication
   * 创建粘性会话，适用于 websocket 通信
   * reference https://github.com/uqee/sticky-cluster
   */
  cteateStickyServer()  {
    const deferred = new Deferred<cluster.Worker[]>();
    const server = net.createServer({ pauseOnConnect: true }, (connection) => {
      const signature = `${connection.remoteAddress}:${connection.remotePort}`;
      this.connections[signature] = connection;
      connection.on('close', () => {
        delete this.connections[signature];
      });
      const index = hash(connection.remoteAddress || '') % this.options.workers;
      let current = -1;
      getAlivedWorkers().some((worker) => {
        // eslint-disable-next-line no-plusplus
        if (index === ++current) {
          worker.send(STIKCY_CONNECTION, connection);
          return true;
        }
        return false;
      });
    });
    server.listen(this.options.port, () => {
      this.forkWorkers().then((data) => {
        deferred.resolve(data);
      });
    });
    return deferred.promise;
  }

  /**
   * Send a reload signal to all work processes
   * 给所有工作进程发送 reload 信号
   */
  reloadWorkers() {
    for (const worker of getAlivedWorkers()) {
      worker.send(RELOAD_SIGNAL);
    }
    return this;
  }

  /**
   * Capture all restart work process signals
   * 捕获所有重启工作进程的信号
   */
  catchSignalToReload() {
    // After the master process receives the reload signal
    // it traverses the surviving worker processes
    // and sends the reload instruction to each worker process
    // 主进程接收到 reload 信号后，遍历存活的工作进程，给每个工作进程发送 reload 指令
    process.once(RELOAD_SIGNAL, () => {
      debug(`Start smooth restart, signal: ${RELOAD_SIGNAL}`);
      this.reloadWorkers();
    });
    // Receives the daze-restart restart instruction
    // sent by the work process to restart all the work processes
    // 接收工作进程发送的 daze-restart 重启指令，重启所有工作进程
    cluster.on('message', (_worker, message) => {
      if (message !== 'daze-restart') return;
      this.reloadWorkers();
    });
  }

  /**
   * Start the service
   * 启动服务
   */
  async run() {
    debug(`current master process id [${process.pid}]`);
    const serverPromise = this.options.sticky ? this.cteateStickyServer() : this.forkWorkers();
    const workers = serverPromise.then((res) => {
      // do something
      this.catchSignalToReload();
      if (this.app.listenerCount('ready') > 0) {
        this.app.emit('ready');
      } else {
        console.log(`服务已启动, 监听端口号为: ${this.app.port}`);
      }
      return res;
    });
    return workers;
  }
}
