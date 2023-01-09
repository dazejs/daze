import path from 'path';
import request from 'supertest';
import { Application } from '../../src';

const app = new Application({
  rootPath: path.resolve(__dirname, '../daze/src')
});


beforeAll(() => app.run(7676));
afterAll(() => app.close());


it('should work base', async () => {
  await request((app as any)._server).get('/example').expect(200, 'Hello Dazejs');
  await request((app as any)._server).get('/example/template').expect(200);
  await request((app as any)._server).get('/example/null').expect(204, '');
  await request((app as any)._server).get('/example/number').expect(200, '0');
  await request((app as any)._server).get('/example/boolean').expect(200, 'true');
});
