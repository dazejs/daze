import path from 'path';
import request from 'supertest';
import { Application } from '../../../src';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('routes', () => {
  it('should return 200 code and all1', async () => {
    await request(app._server)
      .get('/routes/all1')
      .expect(200, 'all1');
  });

  it('should return 200 code and all2', async () => {
    await request(app._server)
      .get('/routes/all2')
      .expect(200, 'all2');
  });
});
