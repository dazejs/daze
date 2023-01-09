
import path from 'path';
import request from 'supertest';
import { Application } from '../../../../src';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../../daze/src')
});

beforeAll(() => app.run());
afterAll(() => app.close());

describe('csrf token', () => {
  it('should return 403 code without token', async () => {
    await request((app as any)._server)
      .post('/csrf')
      .expect(403);
  });

  it('do not verify with read verb [get, head, options]', async () => {
    await request((app as any)._server)
      .get('/csrf/get')
      .expect(200);
  });
});
