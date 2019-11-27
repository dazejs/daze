import path from 'path';
import 'reflect-metadata';
import { Application } from '../../../src/foundation/application';
import { Database } from '../../../src/database/database';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());


describe('Database', () => {
  it('should return database instance use app.get', () => {
    expect(app.get('db')).toBeInstanceOf(Database);
  });

  it('should return database config with connection name', () => {
    const config = app.get('db').getConnectioncConfigure('default');
    expect(config).toEqual({
      type: 'mysql',
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      port: 3306
    });
  });
});