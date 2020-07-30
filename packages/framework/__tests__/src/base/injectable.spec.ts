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

  it('should return id:name when inject in controller', async () => {
    const res = await request(app._server)
      .get('/injectable/name?name=daze&id=1');
    expect(res.text).toBe('1:daze');
  });

  it('should return name default when inject in controller', async () => {
    const res = await request(app._server)
      .get('/injectable/name/default');
    expect(res.text).toBe('daze');
  });

  it('should return params when inject in controller', async () => {
    const res = await request(app._server)
      .get('/injectable/params?x=1&y=2')
      .send({ z: '3' });
    expect(res.body).toEqual({ x: '1', y: '2', z: '3' });
  });

  it('should return daze body when inject in controller', async () => {
    const body = { id: 1, name: "daze", age: 0 };
    const res = await request(app._server)
      .post('/injectable/body')
      .send(body);
    expect(res.body).toEqual(body);
  });

  it('should return daze body2 when inject in controller', async () => {
    const body = { key2: { key1: { id: 1, name: "daze", age: 0 } } };
    const res = await request(app._server)
      .post('/injectable/body2')
      .send(body);
    expect(res.body).toEqual(body.key2.key1);
  });

  it('should return header when inject in controller', async () => {
    const res = await request(app._server)
      .get('/injectable/header')
      .set({ "my-header": "daze" });
    expect(res.text).toEqual('daze');
  });


  it('should return example method', async () => {
    const res = await request(app._server)
      .get('/autoinject');
    expect(res.text).toBe('Hello Dazejs');
  });
});
