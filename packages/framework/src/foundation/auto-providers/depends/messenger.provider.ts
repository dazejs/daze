import { Provide, Provider, AppendAgent, AppendMaster } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Application } from '../../application';
import { MessengerService } from '../../../messenger';

@Provider()
@AppendAgent()
@AppendMaster()
export class MessengerProvider implements ProviderInterface {
  @Provide(MessengerService)
  messenger() {
    return new MessengerService();
  }

  @Provide('messenger')
  loggerAlias(app: Application) {
    return app.get(MessengerService);
  }

  launch(app: Application) {
    app.make(MessengerService);
  }
}