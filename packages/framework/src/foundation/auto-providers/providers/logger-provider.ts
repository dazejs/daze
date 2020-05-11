import { provide } from '../../../decorators';
import { Logger } from '../../../logger/logger';
import { Application } from '../../application';

export class LoggerProvider {
  @provide(Logger)
  _logger(app: Application) {
    return new Logger(app);
  }

  @provide('logger')
  _loggerAlias(app: Application) {
    return app.get(Logger);
  }
}