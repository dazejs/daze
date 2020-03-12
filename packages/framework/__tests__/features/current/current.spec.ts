import request from 'supertest';
import { Application } from '../../../src';

const app = new Application();


beforeAll(() => app.run(7676));
afterAll(() => app.close());


it('should work base', async (done) => {
  await request(app._server).get('/features/current').expect(200, 'hello current');
  done();
});
