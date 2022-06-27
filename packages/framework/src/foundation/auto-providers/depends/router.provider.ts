import { Application } from '../../application';
import { Provide, Provider, AppendAgent } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Router } from '../../../http';

@Provider()
@AppendAgent()
export class RouterProvider implements ProviderInterface {
  @Provide(Router)
  router() {
    return new Router();
  }

  @Provide('router')
  _routerAlias(app: Application) {
    return app.get(Router);
  }
}