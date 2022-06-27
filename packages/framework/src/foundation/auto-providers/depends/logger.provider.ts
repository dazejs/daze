import { provide, disable } from '../../../decorators';
import { Logger } from '../../../logger/logger';
import { Application } from '../../application';

export class LoggerProvider {
  @provide(Logger)
  @disable
  _logger(app: Application) {
    return new Logger(app);
  }

  @provide('logger')
  @disable
  _loggerAlias(app: Application) {
    return app.get(Logger);
  }
}