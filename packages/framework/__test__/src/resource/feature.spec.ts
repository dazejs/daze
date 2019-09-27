
import path from 'path';
import request from 'supertest';
import { Application } from '../../../src';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('Resource Feature', () => {
  it('should return resource when return resource instance in controller (item)', async () => {
    const res = await request(app._server)
      .get('/resource/item')
      .expect(200);
    expect(res.text).toBe(JSON.stringify({
      data: {
        name: 'dazejs',
        type: 'node',
      },
    }));
  });

  it('should return resource when return resource instance in controller (collection)', async () => {
    const res = await request(app._server)
      .get('/resource/collection')
      .expect(200);
    expect(res.text).toBe(JSON.stringify({
      data: [{
        name: 'dazejs',
        type: 'node',
      }, {
        name: 'dazejs',
        type: 'node',
      }],
    }));
  });
});
