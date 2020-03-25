import 'reflect-metadata';
import { Worker } from '../../../src/cluster/worker';
import * as http from 'http';
import request from 'supertest';

describe('Worker Process', () => {
  it('should run with createServer', async () => {
    const worker = new Worker({
      port: 0,
      sticky: false,
      createServer: (...args) => {
        const server = http.createServer((_req, res) => {
          res.end('cluster');
        });
        return server.listen(...args);
      }
    });
    const server = await worker.run();
    const res = await request(server).get('/');
    expect(res.text).toBe('cluster');
    server.close();
  });
});