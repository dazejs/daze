import { Provide, Disable } from '../../../decorators';
import { Database } from '../../../database/database';
import { Application } from '../../application';

export class DatabaseProvider{
  @Provide(Database)
  @Disable
  _database(app: Application) {
    return new Database(app);
  }

  @Provide('db')
  @Disable
  _databaseAlias(app: Application) {
    return app.get(Database);
  }
}