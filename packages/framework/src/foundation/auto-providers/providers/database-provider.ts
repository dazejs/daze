import { provide, disable } from '../../../decorators';
import { Database } from '../../../database/database';
import { Application } from '../../application';

export class DatabaseProvider{
  @provide(Database)
  @disable
  _database(app: Application) {
    return new Database(app);
  }

  @provide('db')
  @disable
  _databaseAlias(app: Application) {
    return app.get(Database);
  }
}