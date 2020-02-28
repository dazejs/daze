import path from 'path';
import { Application } from '../../../src';
import request from 'supertest';

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
});