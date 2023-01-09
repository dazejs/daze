import path from 'path';
import request from 'supertest';
import { Application } from '../../../../src';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../../daze/src')
});


beforeAll(() => app.run());
afterAll(() => app.close());

describe('Request#utils#parse-body', () => {
  it('should parse body when type is json', async () => {
    const res = await request((app as any)._server)
      .post('/example/post')
      .type('json')
      .send({ foo: 'bar' });
    expect(res.body).toEqual({
      body: { foo: 'bar' },
      files: [],
    });
  });

  it('should parse files when type is imultipart', async () => {
    const res = await request((app as any)._server)
      .post('/example/post')
      .field('name', 'dazejs')
      .attach('example', '__tests__/common/assets/example.txt');
    const { example } = res.body.files;
    const { name } = res.body.body;
    expect(example.name).toBe('example.txt');
    expect(name).toBe('dazejs');
  });

  it('should parse files when type is imultipart and multi same param', async () => {
    const res = await request((app as any)._server)
      .post('/example/post')
      .field('name', 'dazejs')
      .field('name', 'dazejs2')
      .attach('example', '__tests__/common/assets/example.txt');
    const { example } = res.body.files;
    const { name } = res.body.body;
    expect(example.name).toBe('example.txt');
    expect(name).toEqual(['dazejs', 'dazejs2']);
  });

  it('should parse files when type is imultipart and array type param', async () => {
    const res = await request((app as any)._server)
      .post('/example/post')
      .field('name', ['dazejs'])
      .field('name', 'dazejs2')
      .attach('example', '__tests__/common/assets/example.txt');
    const { example } = res.body.files;
    const { name } = res.body.body;
    expect(example.name).toBe('example.txt');
    expect(name).toEqual(['dazejs', 'dazejs2']);
  });

  it('should parse files when type is imultipart and multi array type param', async () => {
    const res = await request((app as any)._server)
      .post('/example/post')
      .field('name', ['dazejs'])
      .field('name', ['dazejs2', 'dazejs3'])
      .attach('example', '__tests__/common/assets/example.txt');
    const { example } = res.body.files;
    const { name } = res.body.body;
    expect(example.name).toBe('example.txt');
    expect(name).toEqual(['dazejs', 'dazejs2', 'dazejs3']);
  });
});
