import { Provider } from '../base/provider';
import { provide } from '../decorators/provider';
import { MiddlewareService } from './middleware-service';
import { Application } from '../foundation/application';

export class MiddlewareProvider extends Provider {
  @provide(MiddlewareService)
  _middleware(app: Application) {
    return new MiddlewareService(app);
  }

  @provide('middleware')
  _middlewareAlias(app: Application) {
    return app.get(MiddlewareService);
  }
}