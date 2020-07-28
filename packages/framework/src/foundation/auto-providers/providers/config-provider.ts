import { provide, disable } from '../../../decorators';
import { Config } from '../../../config/config';
import { Application } from '../../application';

export class ConfigProvider {
  @provide(Config)
  @disable
  _config(app: Application) {
    return new Config(app);
  }

  @provide('config')
  @disable
  _configAlias(app: Application) {
    return app.get(Config);
  }
}