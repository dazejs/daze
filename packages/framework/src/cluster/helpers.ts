/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import os from 'os'
import cluster from 'cluster'
import { WORKER_DYING } from './const'
import { IMasterOptions } from './master'

const cpus = os.cpus().length;

/**
 * Analyze the parameters of Cluster module
 * Adds the number of work processes to the parameters
 * 解析 Cluster 模块的参数
 * 添加工作进程数量数量到参数中
 */
export function parseMasterOpts(opts: IMasterOptions) {
  opts.workers = opts.workers || cpus;
  return opts;
};

/**
 * Capture the surviving work process
 * Return an array
 * 获取存活的工作进程
 * 返回一个数组
 */
export function getAlivedWorkers(): cluster.Worker[] {
  const workers = [];
  for (const id in cluster.workers) {
    if (Object.prototype.hasOwnProperty.call(cluster.workers, id)) {
      const worker: any = cluster.workers[id];
      if (exports.isAliveWorker(worker)) {
        workers.push(worker);
      }
    }
  }
  return workers;
};

/**
 * Determine if the work process is alive
 * 判断工作进程是否存活状态
 */
export function isAliveWorker(worker: cluster.Worker) {
  if (!worker.isConnected() || worker.isDead()) return false;
  if (Reflect.getMetadata(WORKER_DYING, worker)) return false
  return true;
};
