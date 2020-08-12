import * as path from 'path';
import request from 'supertest';
import { Application } from '../../../src';

const app = new Application(path.resolve(__dirname, './'));

beforeAll(() => app.run(7777));
afterAll(() => app.close());

describe('Validate Feature', () => {
  it('should success when request legal', async () => {
    await request(app._server)
      .get('/validate/test1?username=test@example.com')
      .expect(200);
  });

  it('should success when request ilegal', async () => {
    await request(app._server)
      .get('/validate/test1?username=ilegal')
      .expect(422);
  });

  it('should success when request legal (check)', async () => {
    await request(app._server)
      .get('/validate/test3?username=test@example.com')
      .expect(200);
  });

  it('should success when request ilegal (check)', async () => {
    await request(app._server)
      .get('/validate/test3?username=ilegal')
      .expect(400);
  });

  it('should success when request legal (custom)', async () => {
    await request(app._server)
      .get('/validate/test4?username=test@example.com')
      .expect(200);
  });

  it('should success when request ilegal (custom)', async () => {
    await request(app._server)
      .get('/validate/test4?username=ilegal')
      .expect(400);
  });

  it('should success when request legal (make)', async () => {
    await request(app._server)
      .get('/validate/test5?username=test@example.com')
      .expect(200);
  });

  it('should success when request ilegal (make)', async () => {
    await request(app._server)
      .get('/validate/test5?username=ilegal')
      .expect(400);
  });
});
