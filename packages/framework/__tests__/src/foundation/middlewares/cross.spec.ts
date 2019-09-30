
import path from 'path';
import request from 'supertest';
import { Application } from '../../../../src';

const app = new Application(path.resolve(__dirname, '../../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('cross origin', () => {
  it('should add options route with cross origin', async () => {
    await request(app._server)
      .options('/cross')
      .expect(200)
  });

  it('should return 204 code when Preflight Request', async () => {
    await request(app._server)
      .options('/cross')
      .set('Access-Control-Request-Method', 'Get')
      .set('Origin', 'http://localhost:8888/')
      .expect(204)
  });
});
