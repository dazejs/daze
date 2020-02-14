import { Provider } from '../base/provider';
import { provide } from '../decorators/provider';
import { Database } from './database';
import { Application } from '../foundation/application';

export class DatabaseProvider extends Provider {
  @provide(Database)
  _database(app: Application) {
    return new Database(app);
  }

  @provide('db')
  _databaseAlias(app: Application) {
    return app.get(Database);
  }
}