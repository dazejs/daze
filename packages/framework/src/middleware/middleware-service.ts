/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Application } from '../foundation/application';
import { Pipeline } from '../pipeline';
import { Request } from '../request';
import { Response } from '../response';


export type TNext = (...args: any[]) => Response | Promise<Response>

export type TMiddlewareStage = (request: Request, next: TNext) => Response | Promise<Response>

export class MiddlewareService {
  app: Application;

  middlewares: any[] = [];

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * register a middleware
   */
  register(middleware: any, args: any[] = []) {
    if (typeof middleware === 'string') {
      this.parseStringMiddleware(middleware, args);
    } else if (typeof middleware === 'function') {
      this.parseFunctionMiddleware(middleware, args);
    }
    return this;
  }

  /**
   * combine another Middleware before this middlewares
   */
  combineBefore(anotherMiddleware: MiddlewareService) {
    if (!(anotherMiddleware instanceof MiddlewareService)) return this;
    this.middlewares.unshift(...anotherMiddleware.middlewares);
    return this;
  }

  /**
   * combine another Middleware after this middlewares
   */
  combineAfter(anotherMiddleware: MiddlewareService) {
    if (!(anotherMiddleware instanceof MiddlewareService)) return this;
    this.middlewares.push(...anotherMiddleware.middlewares);
    return this;
  }

  /**
   * parse middle if middleware type is string type
   */
  parseStringMiddleware(middleware: string, args: any[] = []) {
    const _middleware = this.app.get(`middleware.${middleware}`, args);
    if (!_middleware) return this;
    this.parseClassInstanceMiddleware(_middleware);
    return this;
  }

  /**
   * parse middle if middleware type is function type
   */
  parseFunctionMiddleware(middleware: any, args: any[] = []) {
    // 使用了 @Middleware 装饰器
    if (middleware.prototype && Reflect.getMetadata('type', middleware) === 'middleware') {
      const MiddlewareClass = middleware;
      const _middleware = new MiddlewareClass(...args);
      this.parseClassInstanceMiddleware(_middleware);
    } else {
      this.middlewares.push(middleware);
    }
  }

  /**
   * parse middle if middleware type is class type
   */
  parseClassInstanceMiddleware(middleware: any) {
    this.middlewares.push(async (request: any, next: any) => middleware.resolve(request, next));
  }

  /**
   * handle request event
   */
  async handle(request: Request, dispatcher: (...args: any[]) => any) {
    const result = await (new Pipeline())
      .send(request)
      .pipe(...this.middlewares)
      .process(dispatcher);
    return result;
  }
}
