import path from 'path';
import request from 'supertest';
import { Application } from '../../../src';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.run());
afterAll(() => app.close());

describe('injectable', () => {
  it('should return id when inject in controller', async () => {
    const res = await request(app._server)
      .get('/injectable?id=1');
    expect(res.text).toBe('1');
  });
  
  it('should patch id when inject in resource', async () => {
    const res = await request(app._server)
      .get('/injectable/resource?id=1');
    expect(res.body).toEqual({
      data: {
        id: '1',
        name: 'dazejs'
      }
    });
  });
  
  it('should patch id when inject in service', async () => {
    const res = await request(app._server)
      .get('/injectable/service?id=1');
    expect(res.text).toBe('1');
  });
});
