import { inject, provide } from '../../../decorators';
import { MiddlewareService } from '../../../middleware/middleware-service';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';
export class MiddlewareServiceProvider {

  @inject() app: Application;
  /**
   * inject loader
   */
  @inject() loader: Loader;

  /**
   * auto provide MiddlewareService
   * @param app 
   */
  @provide(MiddlewareService)
  _middleware(app: any) {
    return new MiddlewareService(app);
  }

  /**
   * provide MiddlewareService alias
   * @param app 
   */
  @provide('middleware')
  _middlewareAlias(app: any) {
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
        this.app.singleton(name, (...args: any[]) => {
          return this.app.get(Middleware, args);
        }, true);
      }
    }
  }
}