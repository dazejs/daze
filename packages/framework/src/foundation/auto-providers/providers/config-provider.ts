import { Provide, Disable } from '../../../decorators';
import { Config } from '../../../config/config';
import { Application } from '../../application';

export class ConfigProvider {
  @Provide(Config)
  @Disable
  _config(app: Application) {
    return new Config(app);
  }

  @Provide('config')
  @Disable
  _configAlias(app: Application) {
    return app.get(Config);
  }
}