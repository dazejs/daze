import path from 'path';
import 'reflect-metadata';
import { Application } from '../../../src/foundation/application';
import { initDb } from './init';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());
beforeEach(() => initDb());


afterAll(() => app.get('db').connection().close());

describe('insert record use builder', () => {
  it('should return id when insert success', async () => {
    const id = await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    expect(id).toBe(1);
  });
});

describe('columns in builder',  () => {
  it('should return set columns', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const record = await app.get('db').connection().table('users').columns('name', 'age').first();
    expect(record).toEqual({
      name: 'dazejs',
      age: 18
    });
  });
  it('should return all columns default', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const record = await app.get('db').connection().table('users').columns().first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: null
    });
  });
});

describe('find record use builder', () => {
  it('should return records when find success', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20
    });
    const records = await app.get('db').connection().table('users').columns('id', 'name', 'age').find();
    expect(records).toEqual([{
      id: 1,
      name: 'dazejs',
      age: 18
    }, {
      id: 2,
      name: 'dazejs',
      age: 20
    }]);
  });
});


describe('get record by id use builder', () => {
  it('should return record when get success', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const record = await app.get('db').connection().table('users').columns('id', 'name', 'age').first();
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 18
    });
  });
});


describe('update record use builder', () => {
  it('should return rows number when update success', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    const rows = await app.get('db').connection().table('users').where('id', 1).update({
      age: 20
    });
    const record = await app.get('db').connection().table('users').columns('id', 'name', 'age').first();
    expect(rows).toBe(1);
    expect(record).toEqual({
      id: 1,
      name: 'dazejs',
      age: 20
    });
  });
});

describe('where in get sqls', () => {
  it('should return record use where', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20
    });
    const record1 = await app.get('db').connection().table('users').columns('id', 'name', 'age').where('id', '=', 1).first();
    const record2 = await app.get('db').connection().table('users').columns('id', 'name', 'age').where('id', 2).first();
    expect(record1).toEqual({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    expect(record2).toEqual({
      id: 2,
      name: 'zewail',
      age: 20
    });
  });

  it('should return records use whereIn', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'zewail',
      age: 20
    });
    await app.get('db').connection().table('users').insert({
      id: 3,
      name: 'test',
      age: 22
    });
    const records = await app.get('db').connection().table('users').columns('id', 'name', 'age').whereIn('id', [1, 2]).find();
    expect(records).toEqual([{
      id: 1,
      name: 'dazejs',
      age: 18
    }, {
      id: 2,
      name: 'zewail',
      age: 20
    }]);
  });
});

describe('whereNull in builder', () => {
  it('should return null column', async () => {
    await app.get('db').connection().table('users').insert({
      id: 1,
      name: 'dazejs',
      age: 18,
      description: 'test'
    });
    await app.get('db').connection().table('users').insert({
      id: 2,
      name: 'dazejs',
      age: 20,
    });
    const record = await app.get('db').connection().table('users').columns('id', 'description').whereNull('description').first();
    expect(record).toEqual({
      id: 2,
      description: null
    });
  });
});
