import path from 'path';
import request from 'supertest';
import { Application } from '../../src';

const app = new Application(path.resolve(__dirname, '../daze/src'));


beforeAll(() => app.run());
afterAll(() => app.close());


it('should work base', async () => {
  const res1 = await request(app._server).get('/example');
  expect(res1.status).toBe(200);
  expect(res1.text).toBe('Hello Dazejs');

  const res2 = await request(app._server).get('/example/template');
  expect(res2.status).toBe(200);

  const res3 = await request(app._server).get('/example/null');
  expect(res3.status).toBe(204);
  expect(res3.text).toBe('');

  const res4 = await request(app._server).get('/example/number');
  expect(res4.status).toBe(200);
  expect(res4.text).toBe('0');

  const res5 = await request(app._server).get('/example/boolean').expect(200, 'true');
  expect(res5.status).toBe(200);
  expect(res5.text).toBe('true');
});
