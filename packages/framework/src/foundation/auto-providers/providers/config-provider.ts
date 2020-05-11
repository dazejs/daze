import { provide } from '../../../decorators';
import { Config } from '../../../config/config';
import { Application } from '../../application';

export class ConfigProvider {
  @provide(Config)
  _config(app: Application) {
    return new Config(app);
  }

  @provide('config')
  _configAlias(app: Application) {
    return app.get(Config);
  }
}