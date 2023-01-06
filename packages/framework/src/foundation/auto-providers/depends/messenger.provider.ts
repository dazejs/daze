import { Provide, Provider, AppendAgent, AppendMaster } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Messenger } from '../../../messenger';
import { app } from '../../../helpers';


@Provider()
@AppendAgent()
@AppendMaster()
export class MessengerProvider implements ProviderInterface {
  @Provide(Messenger)
  messenger() {
    return new Messenger();
  }

  @Provide('messenger')
  loggerAlias() {
    return app().get(Messenger);
  }

  launch() {
    app().make(Messenger);
  }
}