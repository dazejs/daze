import path from 'path';
import request from 'supertest';
import { Application } from '../../../src';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('redirect feature', () => {
  it('should return 302 code default', async () => {
    await request(app._server)
      .get('/redirect')
      .expect(302)
      .expect('Location', 'https://www.google.com');
  });
});
