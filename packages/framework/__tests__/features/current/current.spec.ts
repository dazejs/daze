import request from 'supertest';
import { Application } from '../../../src';

const app = new Application();

beforeAll(() => app.run(7676));
afterAll(() => app.close());

it('should work base', async () => {
  const res = await request(app._server).get('/features/current');
  expect(res.status).toBe(200);
  expect(res.text).toBe('hello current');
});
