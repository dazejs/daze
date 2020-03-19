import 'reflect-metadata';
import { Worker } from '../../../src/cluster/worker';
import * as http from 'http';


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

(async () => {
  await worker.run();

  process.on('message', (opt: any) => {
    if (opt.type === 'disconnect') {
      worker.disconnect(false);
      process.send?.({
        type: 'close',
      });
    }
  });
  
  process.send?.({
    type: 'ready',
  });
})();


