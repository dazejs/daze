import path from 'path';
import 'reflect-metadata';
import { Application } from '../../../src/foundation/application';
import { Database } from '../../../src/database/database';
import { initDb } from './init';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());
beforeEach(() => initDb());


afterAll(() => app.get('db').connection().close());


describe('Database Common', () => {
  it('should return database instance use app.get', () => {
    expect(app.get('db')).toBeInstanceOf(Database);
  });

  it('should return database config with connection name', () => {
    const config = app.get('db').getConnectioncConfigure('default');
    expect(config).toEqual({
      type: 'mysql',
      host: 'localhost',
      user: 'root',
      password: 'root',
      port: 13306,
      database: 'daze'
    });
  });
});

describe('insert record', () => {
  it('should return id when insert success', async () => {
    const id = await app.get('db').connection().insert(`insert into users (id, name, age) values (1, 'dazejs', 1)`);
    expect(id).toBe(1);
  });
});

describe('select record', () => {
  it('should return record when select success', async () => {
    await app.get('db').connection().insert(`insert into users (id, name, age) values (1, 'dazejs', 1)`);
    const rows = await app.get('db').connection().select(`select id, name, age from users`);
    expect(rows).toEqual([{
      id: 1,
      age: 1,
      name: 'dazejs'
    }]);
  });
});

describe('update record', () => {
  it('should return rows when update success', async () => {
    await app.get('db').connection().insert(`insert into users (id, name, age) values (1, 'dazejs', 1)`);
    const rows = await app.get('db').connection().update(`update users set age=2 where id=1`);
    expect(rows).toBe(1);
  });
});



describe('delete record', () => {
  it('should return rows when update success', async () => {
    await app.get('db').connection().insert(`insert into users (id, name, age) values (1, 'dazejs', 1)`);
    const rows = await app.get('db').connection().delete(`delete from users where id=1`);
    const selects = await app.get('db').connection().select(`select id, name, age from users`);
    expect(rows).toBe(1);
    expect(selects).toEqual([]);
  });
});