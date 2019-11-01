import path from 'path';
import request from 'supertest';
import { Application } from '../../src';

const app = new Application(path.resolve(__dirname, '../daze/src'));


beforeAll(() => app.run());
afterAll(() => app.close());


it('should work base', async (done) => {
  await request(app._server).get('/example').expect(200);
  done();
});
