import path from 'path';
import { Application } from '../../../src';
import request from 'supertest';
import {
  ExampleMiddlewareOrder,
  ExampleMiddlewareOrder0,
  ExampleMiddlewareOrder1,
  ExampleMiddlewareOrderMax,
  ExampleMiddlewareOrderMax1,
  ExampleMiddlewareOrderMin
} from '../../daze/src/app/middleware/example-order';
import { MiddlewareService } from '../../../src/middleware';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('Middleware', () => {
  it('should use method middleware message when pass name query', async () => {
    await request(app._server).get('/middleware/example1').expect(200, 'Hello Dazejs');
    await request(app._server).get('/middleware/example1?name=example1').expect(200, 'Hello Example1');
  });

  it('should use class middleware message when pass name query', async () => {
    await request(app._server).get('/middleware/example1').expect(200, 'Hello Dazejs');
    await request(app._server).get('/middleware/example1?name=example2').expect(200, 'Hello Example2');
  });
  
  it('test middleware with order', async () => {
    const middlewareService = app.get<MiddlewareService>(MiddlewareService);
    middlewareService.register(ExampleMiddlewareOrder);
    middlewareService.register(ExampleMiddlewareOrder0);
    middlewareService.register(ExampleMiddlewareOrder1);
    middlewareService.register(ExampleMiddlewareOrderMax1);
    middlewareService.register(ExampleMiddlewareOrderMax);
    middlewareService.register(ExampleMiddlewareOrderMin);
    const values = await Promise.all(middlewareService.middlewares.map(o => o.resolver(null, null)));
    expect(values).toEqual([
      'ExampleMiddlewareOrderMin',
      'ExampleMiddlewareOrder0',
      'ExampleMiddlewareOrder1',
      'ExampleMiddlewareOrder',
      'ExampleMiddlewareOrderMax',
      'ExampleMiddlewareOrderMax1'
    ]);
  });
});
