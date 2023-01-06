import { Provide, Provider, AppendAgent, AppendMaster } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Application } from '../../application';
import { Logger } from '../../../supports/logger';
import { app } from '../../../helpers';

@Provider()
@AppendAgent()
@AppendMaster()
export class LoggerProvider implements ProviderInterface {
  @Provide(Logger)
  logger(app: Application) {
    return new Logger(app);
  }

  @Provide('logger')
  loggerAlias(app: Application) {
    return app.get(Logger);
  }

  launch() {
    const logger = app().get<Logger>(Logger);
    if (app().isAgent) {
      Logger.Cluster.bindListener(logger);
    }
  }
}