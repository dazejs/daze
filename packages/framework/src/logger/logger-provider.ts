import { Provider } from '../base';
import { provide } from '../decorators/provider';
import { Logger } from './logger';
import { Application } from '../foundation/application';

export class LoggerProvider extends Provider {
  @provide(Logger)
  _logger(app: Application) {
    return new Logger(app);
  }

  @provide('logger')
  _loggerAlias(app: Application) {
    return app.get(Logger);
  }
}