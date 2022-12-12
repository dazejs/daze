import { Provide, Disable } from '../../../decorators';
import { Logger } from '../../../logger/logger';
import { Application } from '../../application';

export class LoggerProvider {
  @Provide(Logger)
  @Disable
  _logger(app: Application) {
    return new Logger(app);
  }

  @Provide('logger')
  @Disable
  _loggerAlias(app: Application) {
    return app.get(Logger);
  }
}