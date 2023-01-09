import request from 'supertest';
import { Application } from '../../../src';

const app = new Application();


beforeAll(() => app.run(7677), 10);
afterAll(() => app.close(), 10);


it('should work base', async () => {
  await request((app as any)._server).get('/features/current').expect(200, 'hello current');
});
