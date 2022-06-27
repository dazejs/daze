import { Provide, Provider } from '../../../decorators';
import { AppServer } from '../../../http/server';
import { ProviderInterface } from '../../../interfaces';
import { Application } from '../../application';

@Provider()
export class AppServerProvider implements ProviderInterface {
  @Provide('appServer')
  httpServer() {
    return new AppServer();
  }

  async launch(app: Application) {
    app.get<AppServer>('appServer').createServer();
  }
}