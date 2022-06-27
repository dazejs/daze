/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

// The main process receives an interrupt signal to restart the working process
// 主进程接收中断信号来重启工作进程
export const RELOAD_SIGNAL = 'SIGUSR2';

// Whether the work process has been restarted
// 工作进程是否已进行重启
export const WORKER_DYING = 'daze-worker-dying';

// After the main process reforks the worker process,
// it notifies the corresponding worker process to terminate the service
// 主进程重新 fork 工作进程后通知对应工作进程让其结束服务的信号
export const WORKER_DID_FORKED = 'daze-worker-did-fork';

// Signal that the work process is about to stop providing service to the main process
// 工作进程即将停止提供服务通知主进程的信号
export const WORKER_DISCONNECT = 'daze-worker-disconnect';

// sticky sessions for websocket communication
export const STIKCY_CONNECTION = 'daze-sticky-connection';

// daze process type
export const DAZE_PROCESS_TYPE = 'daze:process:type';
