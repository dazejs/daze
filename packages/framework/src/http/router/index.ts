/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Container } from '../../container';
import { Application } from '../../foundation/application';
import { CORSMiddleware } from '../../foundation/buildin-app/middlewares/cors';
import { Request } from '../request';
// import { Response } from '../response';
import { Dispatcher } from './dispatcher';
import { Route } from './route';
import { Trie } from './trie';
import { UseMiddlewareOption } from '../../decorators/use/interface';
import { Str } from '../../utils/str';
import { MiddlewareService } from '../middleware';
import debuger from 'debug';

const OPTIONAL_PARAM_REGEXP = /(\/:[^/()]*?)\?(\/?)/;

const debug = debuger('@dazejs/framework:router');

export class Router {
  /**
   * 应用实例
   */
  private app: Application = Container.get('app');

  /**
   * 前缀树
   */
  private trie: Trie = new Trie();

  /**
   * 列表
   */
  private list: Route[] = [];

  /**
   * 全局中间件
   */
  private middleware: MiddlewareService;

  /**
   * 创建路由
   */
  constructor() {
    this.middleware = new MiddlewareService(this.app);
  }

  /**
   * 获取路有数组
   * @returns 
   */
  public getList() {
    return this.list;
  }

  /**
   * 获取路有树
   * @returns 
   */
  public getTire() {
    return this.trie;
  }

  /**
   * 判断路有书否存在
   * @param method 
   * @param uri 
   * @returns 
   */
  public exists(method: string, uri: string) {
    return !!this.getRoute(method, uri);
  }

  /**
   * 根据 uri 和 method 获取路有实例
   * @param method 
   * @param uri 
   * @returns 
   */
  public getRoute(method: string, uri: string): Route | undefined {
    const finalUri = Str.formatPrefix(this.app.get('config').get('app.baseUrl', '')) + Str.formatPrefix(uri);
    return this.trie.match(method.toUpperCase(), finalUri)?.route;
  }

  /**
   * 注册全局中间件
   * @param Mid
   * @param args
   */
  public registerMiddleware(Mid: any, args = []) {
    this.middleware.register(Mid, args);
  }

  /**
   * 匹配路由
   * @param method 
   * @param requestPath 
   * @returns 
   */
  public match(method = 'GET', requestPath: string) {
    return this.trie.match(method, requestPath);
  }

  /**
   * 创建路由执执行方法
   * @returns
   */
  public createResolver(_matchedRoute?: any) {
    return async (request: Request) => {
      const method = request.getMethod()??'';
      const requestPath = request.getPath();
      const metchedRoute = _matchedRoute ?? this.match(method, requestPath);
      debug(`已匹配路由:[${method}] - [${requestPath}] - ${!!metchedRoute}`);
      const dispatcher = new Dispatcher(request, metchedRoute);
      const res = await dispatcher.resolve();
      return res;
    };
  }

  /**
   * 注册路由
   * @param uri
   * @param methods
   * @param option
   * @param controller
   * @param action
   * @param middlewareOptions
   * @returns
   */
  public register(uri: string, methods: string[], option: any, controller: any, action?: string, middlewareOptions: UseMiddlewareOption[] = []) {
    const optionalParamMatch = uri.match(OPTIONAL_PARAM_REGEXP);
    if (optionalParamMatch) {
      const pathFull = uri.replace(OPTIONAL_PARAM_REGEXP, '$1$2');
      const pathOptional = uri.replace(OPTIONAL_PARAM_REGEXP, '$2');
      this.register(pathFull, methods, option, controller, action, middlewareOptions);
      this.register(pathOptional, methods, option, controller, action, middlewareOptions);
    }
    this._register(uri, methods, option, controller, action, middlewareOptions);
   
  }

  /**
   * private register
   * @param uri 
   * @param methods 
   * @param option 
   * @param controller 
   * @param action 
   * @param middlewareOptions 
   */
  private _register(uri: string, methods: string[], option: any, controller: any, action?: string, middlewareOptions: UseMiddlewareOption[] = []) {
    const isStereotypeController = Reflect.getMetadata('type', controller) === 'controller';
    if (isStereotypeController && typeof controller !== 'function') throw new Error('route must be register an controller!');
    const finalUri =
        (
          (option?.baseUrl !== undefined && option?.baseUrl !== null)
            ? Str.formatPrefix(option?.baseUrl)
            : Str.formatPrefix(this.app.get('config').get('app.baseUrl', ''))
        ) + Str.formatPrefix(uri); 
    const route = new Route(finalUri, methods, controller, action);
    for (const middlewareOption of middlewareOptions) {
      route.registerMiddleware(middlewareOption?.middleware, middlewareOption?.args);
    }
    if (isStereotypeController && action) {
      const controllerCrossOrigin = Reflect.getMetadata('controllerCrossOrigin', controller);
      const routeCrossOrigin = Reflect.getMetadata('routeCrossOrigin', controller) || {};
      if (controllerCrossOrigin) {
        route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [controllerCrossOrigin]);
      } else if (routeCrossOrigin[action]) {
        route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [routeCrossOrigin[action]]);
      }
      // 响应数据是否加密
      const enctypt = Reflect.getMetadata('encrypt', controller, action) || Reflect.getMetadata('encrypt', controller);
      if (enctypt) route.enctypt = true;
    }
    this.trie.add(route);
    this.list.push(route);
  }

  // register(uri: string, methods: string[], option: any, controller: any, action?: string, middlewareOptions: UseMiddlewareOption[] = []) {
  //   const isStereotypeController = Reflect.getMetadata('type', controller) === 'controller';
  //   if (isStereotypeController && typeof controller !== 'function') throw new Error('route must be register an controller!');
  //   const finalUri =
  //     (
  //       (option?.baseUrl !== undefined && option?.baseUrl !== null)
  //         ? Str.formatPrefix(option?.baseUrl)
  //         : Str.formatPrefix(this.app.get('config').get('app.baseUrl', ''))
  //     ) + Str.formatPrefix(uri);
  //   const route = new Route(finalUri, methods, controller, action);
  //   for (const middlewareOption of middlewareOptions) {
  //     route.registerMiddleware(middlewareOption.middleware, middlewareOption.args);
  //   }
  //   if (isStereotypeController && action) {
  //     const controllerCrossOrigin = Reflect.getMetadata('controllerCrossOrigin', controller);
  //     const routeCrossOrigin = Reflect.getMetadata('routeCrossOrigin', controller) || {};
  //     if (controllerCrossOrigin) {
  //       route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [controllerCrossOrigin]);
  //     } else if (routeCrossOrigin[action]) {
  //       route.addMethod('OPTIONS').registerMiddleware(CORSMiddleware, [routeCrossOrigin[action]]);
  //     }
  //     // 路由响应是否加密
  //   const enctypt = Reflect.getMetadata('encrypt', controller, action) || Reflect.getMetadata('encrypt', controller);
  //   if (enctypt) route.enctypt = true;
  // }

  //   this.trie.add(route);
  //   return route;
  // }
}
