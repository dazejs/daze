import 'reflect-metadata';
import os from 'os';
import cluster from 'cluster';
import { parseMasterOpts, isAliveWorker, getAlivedWorkers } from '../../../src/cluster/helpers';
import { WORKER_DYING } from '../../../src/cluster/const';

describe('Cluster#helpers', () => {
  it('should set default cpus when no workers', () => {
    const options1 = {
      workers: 1,
      port: 8888,
      sticky: false,
    };
    expect(parseMasterOpts(options1)).toEqual({
      workers: 1,
      port: 8888,
      sticky: false,
    });
    const options2 = {
      workers: 0,
      port: 8888,
      sticky: false,
    };
    expect(parseMasterOpts(options2)).toEqual({
      workers: os.cpus().length,
      port: 8888,
      sticky: false,
    });
  });

  describe('isAliveWorker', () => {
    it('should return worker alivable by isAliveWorker', () => {
      if (cluster.isMaster) {
        const worker = cluster.fork();
        expect(isAliveWorker(worker)).toBeTruthy();
        worker.process.kill();
      }
    });

    it('should return false by isAliveWorker when disconnect', (done) => {
      if (cluster.isMaster) {
        const worker = cluster.fork();
        worker.on('disconnect', () => {
          expect(isAliveWorker(worker)).toBeFalsy();
          worker.process.kill();
          done();
        });
        worker.disconnect();
      }
    });

    it('should return worker alivable by isAliveWorke when kill', (done) => {
      const worker = cluster.fork();
      worker.on('exit', () => {
        expect(isAliveWorker(worker)).toBeFalsy();
        done();
      });
      worker.process.kill();
    });

    it('should return false when dying', () => {
      const worker = cluster.fork();
      Reflect.defineMetadata(WORKER_DYING, true, worker);
      expect(isAliveWorker(worker)).toBeFalsy();
      worker.process.kill();
    });
  });

  describe('getAlivedWorkers', () => {
    it('should return alived works', () => {
      if (cluster.isMaster) {
        const worker1 = cluster.fork();
        const worker2 = cluster.fork();
        const worker3 = cluster.fork();
        const worker4 = cluster.fork();

        const workers = getAlivedWorkers();

        expect(workers.includes(worker1)).toBeTruthy();
        expect(workers.includes(worker2)).toBeTruthy();
        expect(workers.includes(worker3)).toBeTruthy();
        expect(workers.includes(worker4)).toBeTruthy();

        worker1.process.kill();
        worker2.process.kill();
        worker3.process.kill();
        worker4.process.kill();
      }
    });
  });
});
