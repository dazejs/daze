import path from 'path';
import { Application } from '../../../src';
import { initDb } from './init';
import User from '../../daze/src/app/entities/user';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());
beforeEach(() => initDb());

afterAll(() => app.get('db').connection().close());

describe('create a model', () => {
  it('should create model as insert', async () => {
    const user = new User();
    const model = await user.create({
      id: 1,
      name: 'dazejs',
      age: 30,
      description: 'test2'
    });
    expect(model.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 30,
      description: 'test2'
    });
    const reuser = await user.get(1);
    expect(reuser.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 30,
      description: 'test2'
    });
  });
});


describe('save a model', () => {
  it('should save model as insert', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    const res = await user.save();
    expect(res).toBeTruthy();
    const record = await app.get('db').connection().table('users').where('id', 1).first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1'
    });
  });
  it('should save model as update', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.get(1);
    res.age = 20;
    await res.save();
    const record = await app.get('db').connection().table('users').where('id', 1).first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 20,
      description: 'test1'
    });
  });
});

describe('get in model', () => {
  it('should return a model', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.get(1);
    expect(res).toBeInstanceOf(User);
  });
  it('should return rigth record attr', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.get(1);
    expect(res.getAttributes()).toEqual({
      id: 1,
      name: 'dazejs',
      age: 10,
      description: 'test1'
    });
  });
});

describe('destroy in model', () => {
  it('should destroy record', async () => {
    const user = new User();
    user.id = 1;
    user.name = 'dazejs';
    user.age = 10;
    user.description = 'test1';
    await user.save();
    const res = await user.destroy(1);
    const count = await app.get('db').connection().table('users').count();
    expect(res).toBe(1);
    expect(count).toBe(0);
  });
});