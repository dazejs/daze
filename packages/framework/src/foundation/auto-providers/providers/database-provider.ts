import { provide } from '../../../decorators/provider';
import { Database } from '../../../database/database';
import { Application } from '../../application';

export class DatabaseProvider{
  @provide(Database)
  _database(app: Application) {
    return new Database(app);
  }

  @provide('db')
  _databaseAlias(app: Application) {
    return app.get(Database);
  }
}