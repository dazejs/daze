import { Provide, Provider, AppendAgent } from '../../../decorators';
import { ProviderInterface } from '../../../interfaces';
import { Router } from '../../../http/router';
import { app } from '../../../helpers';

@Provider()
@AppendAgent()
export class RouterProvider implements ProviderInterface {
  @Provide(Router)
  router() {
    return new Router();
  }

  @Provide('router')
  _routerAlias() {
    return app().get(Router);
  }
}