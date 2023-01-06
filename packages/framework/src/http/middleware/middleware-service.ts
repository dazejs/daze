/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Application } from '../../foundation/application';
import { Pipeline } from '../../pipeline';
import { Request } from '../request';
import { Response } from '../response';
import { ProviderType } from '../../symbol';

export type Next = (...args: any[]) => Promise<Response> | Response
export type MiddlewareStage = (request: Request, next: Next) => Promise<Response>
interface TMiddlewareMeta {
  resolver(request: any, next: any): any;
  readonly order: number;
} 

export class MiddlewareService {
  app: Application;

  middlewares: TMiddlewareMeta[] = [];

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
    this.reSortMiddlewaresByOrder();
    return this;
  }

  /**
   * combine another Middleware before this middlewares
   */
  combineBefore(anotherMiddleware: MiddlewareService) {
    if (!(anotherMiddleware instanceof MiddlewareService)) return this;
    const wrappedMiddlewares = anotherMiddleware.middlewares?.map(this.wrapperMiddleware);
    this.middlewares.unshift(...wrappedMiddlewares);
    this.reSortMiddlewaresByOrder();
    return this;
  }

  /**
   * combine another Middleware after this middlewares
   */
  combineAfter(anotherMiddleware: MiddlewareService) {
    if (!(anotherMiddleware instanceof MiddlewareService)) return this;
    const wrappedMiddlewares = anotherMiddleware.middlewares?.map(this.wrapperMiddleware);
    this.middlewares.push(...wrappedMiddlewares);
    this.reSortMiddlewaresByOrder();
    return this;
  }

  /**
   * parse middle if middleware type is string type
   */
  parseStringMiddleware(middlewareName: string, args: any[] = []) {
    const middleware = this.app.get(middlewareName, args);
    if (!middleware) return;
    this.parseClassInstanceMiddleware(middleware);
  }

  /**
   * parse middle if middleware type is function type
   */
  parseFunctionMiddleware(middleware: any, args: any[] = []) {
    // 使用了 @Middleware 装饰器
    if (middleware.prototype && Reflect.getMetadata('type', middleware) === 'middleware') {
      const _middleware = this.app.get(middleware, args);
      if (!_middleware) return;
      this.parseClassInstanceMiddleware(_middleware);
    } else {
      this.middlewares.push(this.wrapperMiddleware(middleware));
    }
  }

  /**
   * parse middle if middleware type is class type
   */
  parseClassInstanceMiddleware(middleware: any) {
    this.middlewares.push(this.wrapperMiddleware(middleware));
  }

  /**
   * Wrapper a middleware with order and resolver
   */
  wrapperMiddleware(middleware: any): TMiddlewareMeta {
    // check if TMiddlewareMeta
    if ('resolver' in middleware) {
      return middleware;
    } 
    // wrapper function
    else if (typeof middleware === 'function') {
      const order = Reflect.getMetadata(ProviderType.ORDER, middleware) ?? Number.MAX_SAFE_INTEGER;
      return {
        resolver: middleware,
        order
      };
    } 
    // wrapper object
    else {
      const order = Reflect.getMetadata(ProviderType.ORDER, middleware.constructor) ?? Number.MAX_SAFE_INTEGER;
      return {
        resolver: async (request: any, next: any) => middleware.resolve(request, next),
        order
      };
    }
  }

  /**
   * resort middlewares by order
   */
  reSortMiddlewaresByOrder() {
    this.middlewares.sort((o1, o2) => o1.order - o2.order);
  }

  /**
   * handle request event
   */
  async handle(request: Request, dispatcher: (...args: any[]) => any) {
    const result = await (new Pipeline())
      .send(request)
      .pipe(...this.middlewares.map(o => o.resolver))
      .process(dispatcher);
    return result;
  }
}
