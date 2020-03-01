import { Provider } from '../base/provider';
import { inject } from '../decorators/inject';
import { provide } from '../decorators/provider';
import type { Application } from '../foundation/application';
import type { Loader } from '../loader';
import { MiddlewareService } from './middleware-service';

export class MiddlewareServiceProvider extends Provider {
  /**
   * inject loader
   */
  @inject('loader') loader: Loader;

  /**
   * auto provide MiddlewareService
   * @param app 
   */
  @provide(MiddlewareService)
  _middleware(app: Application) {
    return new MiddlewareService(app);
  }

  /**
   * provide MiddlewareService alias
   * @param app 
   */
  @provide('middleware')
  _middlewareAlias(app: Application) {
    return app.get(MiddlewareService);
  }

  /**
   * resolve middlewares when app started
   */
  launch() {
    const middlewares = this.loader.getComponentsByType('middleware') || [];
    for (const Middleware of middlewares) {
      const name = Reflect.getMetadata('name', Middleware);
      this.app.singleton(Middleware, Middleware);
      if (name) {
        this.app.singleton(`middleware.${name}`, (...args: any[]) => {
          return this.app.get(Middleware, args);
        }, true);
      }
    }
  }
}