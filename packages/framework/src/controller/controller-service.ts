import { Application } from '../foundation/application';
import { UseMiddlewareOption } from '../decorators/use/interface';
import { Router } from '../http/router';

/**
 * 控制器解析类
 */
export class ControllerService {
  /**
     * 应用实例
     */
  public app: Application;

  /**
     * 控制器解析类构造函数
     * @param app
     */
  constructor(app: Application) {
    this.app = app;
  }

  /**
     * 注册一个控制器
     */
  public register(controller: any) {
    if (Reflect.getMetadata('type', controller) !== 'controller') return this;
    this.resolve(controller);
    return this;
  }

  /**
     * 解析控制器
     */
  public resolve(controller: any) {
    const routes = Reflect.getMetadata('routes', controller) || {};
    const prefixs = Reflect.getMetadata('prefixs', controller) || [''];
    for (const prefix of prefixs) {
      this.registerRoutes(controller, routes, prefix);
    }
  }

  /**
     * 注册控制器路由
     */
  private registerRoutes(controller: any, routes: any, prefix = '') {
    const router = this.app.get<Router>('router');
    const controllerMiddlewareOptions: UseMiddlewareOption[] = Reflect.getMetadata('use-middlewares', controller) ?? [];
    for (const key of Object.keys(routes)) {
      const routeMiddlewares: { [key: string]: UseMiddlewareOption[] } = Reflect.getMetadata('use-middlewares', controller, key) ?? {};
      for (const route of routes[key]) {
        const { uri, method, option } = route;
        const actionMiddlewareOptions = routeMiddlewares[key] ?? [];
        router.register(`${prefix}${uri}`, [method], option, controller, key, [...controllerMiddlewareOptions, ...actionMiddlewareOptions]);
      }
    }
  }
}
