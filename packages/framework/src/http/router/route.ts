/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';
import { pathToRegexp, Key, match } from 'path-to-regexp';
 
import { Container } from '../../container';
import { Application } from '../../foundation/application';
import { MiddlewareService } from '../middleware';
import { Request } from '../request';
import { Response } from '../response';
import { parsePattern } from './helpers';
 
import debuger from 'debug';
 
const debug = debuger('@daze/framework:route');
 
export class Route {
 
  /**
   * application
   */
  app: Application = Container.get('app');
 
  /**
   * route params keys
   */
  keys: Key[] = [];
 
  /**
   * request uri
   */
  uri: string;
 
  /**
   * route methods
   */
  methods: string[];
 
  /**
    * route regexp
    */
  regexp: RegExp;
 
  /**
   * route matcher
   */
  matcher: Function;
 
  /**
   * route controller
   */
  controller: any;
 
  /**
   * route controller action
   */
  action: string;
 
  /**
   * route middleware instance
   */
  middleware: MiddlewareService;

  /**
   * 是否加密
   */
  enctypt = false;
 
  /**
   * Create Route
   * @param uri route URI
   * @param methods route methods
   * @param controller controller
   * @param action controller action
   * @param middlewares route middlewares
   */
  constructor(uri: string, methods: string[] = [], controller: any = null, action = '') {
 
    /**
     * middleware service
     */
    this.middleware = this.app.make(MiddlewareService, [], true);
 
    /**
     * @type uri URI
     */
    this.uri = uri;
 
    /**
     * @type methods upper case method name
     */
    this.methods = this.parseMethods(methods);
 
    /**
     * @type regexp path RegExp
     */
    this.regexp = pathToRegexp(uri.replace(/\/\*$/, '/:rests(.*)'), this.keys);
 
    /**
     * match
     */
    this.matcher = match(uri.replace(/\/\*$/, '/:rests(.*)'), { decode: decodeURIComponent });
 
    /**
     * @type controller controller
     */
    this.controller = controller;
 
    /**
     * @type action controller action name
     */
    this.action = action;
 
    /**
     * patch HEAD method with GET method
     */
    if (this.methods.includes('GET') && !this.methods.includes('HEAD')) {
      this.methods.push('HEAD');
    }
  }
 
  get pieces() {
    const paths = parsePattern(this.uri);
    const res: any[] = [];
    for (const _path of paths) {
      if (_path === '*') {
        res.push({
          key: _path,
          type: 'all'
        });
      } else {
        const keys: any[] = [];
        const reg = pathToRegexp(_path, keys);
        if (!keys.length) {
          res.push({
            key: _path,
            type: 'static'
          });
        } else {
          res.push({
            key: reg,
            type: 'reg'
          });
        }
      }
    }
    return res;
  }
 
  /**
   * register route middleware
   * @param middleware
   */
  registerMiddleware(middleware: any, args: any[]) {
    if (middleware && typeof middleware === 'function') {
      this.middleware.register(middleware, args);
    }
    return this;
  }
 
  addMethod(method: string) {
    const _method = method.toUpperCase();
    if (http.METHODS.includes(_method) && !this.methods.includes(_method)) {
      this.methods.push(_method);
    }
    return this;
  }
 
 
  parseMethods(methods: string[] = []) {
    const _methods: string[] = [];
    for (const method of methods) {
      const _method = method.toUpperCase();
      _methods.push(_method);
    }
    return [...new Set(_methods)];
  }
 
  /**
   * get route params
   * @param requestPath request path
   */
  getParams(requestPath: string) {
    return {
      ...this.matcher(requestPath).params
    };
  }
 
  getParamsArr(requestPath: string) {
    return Object.values(this.getParams(requestPath));
  }
 
  /**
   * register Middlewares in Middleware instance
   */
  registerControllerMiddlewares(middlewares: any) {
    if (!Array.isArray(middlewares)) return this;
    for (const middleware of middlewares) {
      this.middleware.register(middleware);
    }
    return this;
  }
 
  async resolve(request: Request) {


    // const isStereotypeController = Reflect.getMetadata('type', this.controller) === 'controller';
    // const routeParams = this.getParams(request.path);
    // if (isStereotypeController) {
    //   const controller = this.app.get(this.controller, [request]);
    //   const res = await controller[this.action](...routeParams);
    //   if (res instanceof Response) return res.encrypt(this.enctypt);
    //   return (new Response()).setData(res).encrypt(this.enctypt);
    // }
    // const res = await this.controller(request, ...routeParams);
    // if (res instanceof Response) return res.encrypt(this.enctypt);
    // return (new Response()).setData(res).encrypt(this.enctypt);


    const isStereotypeController = Reflect.getMetadata('type', this.controller) === 'controller';
    const routeParams = this.getParamsArr(request.path);
    debug('开始处理路由方法');
    try {
      if (isStereotypeController) {
        const controller = this.app.get(this.controller, [request]);
        const res = await controller[this.action](...routeParams);
        if (res instanceof Response) return res.encrypt(this.enctypt);
        return (new Response()).setData(res).encrypt(this.enctypt);
      }
      const res = await this.controller(request, ...routeParams);
      if (res instanceof Response) return res.encrypt(this.enctypt);
      return (new Response()).setData(res).encrypt(this.enctypt);
    } catch (err) {
      throw err;
    }
  }
}
