import { Provider } from '../base/provider';
import { provide } from '../decorators/provider/provide';
import { Config } from './config';
import { Application } from '../foundation/application';

export class ConfigProvider extends Provider {
  @provide(Config)
  _config(app: Application) {
    return new Config(app);
  }

  @provide('config')
  _configAlias(app: Application) {
    return app.get(Config);
  }
}