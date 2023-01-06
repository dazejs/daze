import { Provide, Provider } from '../../../decorators';
import { AppServer } from '../../../http/server';
import { ProviderInterface } from '../../../interfaces';
import { app } from '../../../helpers';

@Provider()
export class AppServerProvider implements ProviderInterface {
  @Provide('appServer')
  httpServer() {
    return new AppServer();
  }

  launch() {
    app().get<AppServer>('appServer').createServer();
  }
}