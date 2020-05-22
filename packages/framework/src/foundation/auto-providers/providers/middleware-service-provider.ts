import { inject, provide } from '../../../decorators';
import { MiddlewareService } from '../../../middleware/middleware-service';
import { Loader } from '../../../loader/loader';
import { Application } from '../../application';
import { Str } from '../../../utils';

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
      const injectionName: string | undefined = Reflect.getMetadata('name', Middleware) ?? Str.decapitalize(Middleware?.name);
      this.app.singleton(Middleware, Middleware);
      if (injectionName && !injectionName.startsWith('default')) {
        if (this.app.has(injectionName)) throw new Error(`specified middleware name ${injectionName} conflicts with existing!`);
        this.app.singleton(injectionName, (...args: any[]) => {
          return this.app.get(Middleware, args);
        }, true);
      }
    }
  }
}