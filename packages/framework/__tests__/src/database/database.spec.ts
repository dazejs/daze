import path from 'path';
import 'reflect-metadata';
import { Application } from '../../../src/foundation/application';
import { Database } from '../../../src/database/database';
import { initDb } from './init';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());
beforeAll(() => initDb());


afterAll(() => app.get('db').connection().close());


describe('Database Common', () => {
  it('should return database instance use app.get', () => {
    expect(app.get('db')).toBeInstanceOf(Database);
  });

  it('should return database config with connection name', () => {
    const config = app.get('db').getConnectioncConfigure('default');
    expect(config).toEqual({
      type: 'mysql',
      host: 'mysql',
      user: 'root',
      password: 'password',
      port: 13306,
      database: 'daze'
    });
  });
});

describe('insert record', () => {
  it('should return id when insert success', async () => {
    const id = await app.get('db').connection().table('users').insert({
      name: 'dazejs',
      age: 1
    });
    expect(id).toBe(1);
    app.get('db').connection();
  });
});