import { Provider } from '../base/provider';
import { provide } from '../decorators/provider';
import { Middleware } from './middleware';
import { Application } from '../foundation/application';

export class MiddlewareProvider extends Provider {
  @provide(Middleware)
  _middleware(app: Application) {
    return new Middleware(app);
  }

  @provide('middleware')
  _middlewareAlias(app: Application) {
    return app.get(Middleware);
  }
}