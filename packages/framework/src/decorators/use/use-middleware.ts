/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { UseMiddlewareOption } from './interface';

/**
 * use middleware on controller
 * 
 * @param middleware 
 */
export const useMiddleware = function (middleware: any, middlewareArgs: any[] = []) {
  return function (...args: any[]) {
    // decorator class
    if (args.length === 1) {
      const [target] = args;
      // const middlewares = Reflect.getMetadata('controllerMiddlewares', target) || [];
      const middlewaresMeta: UseMiddlewareOption[] = Reflect.getMetadata('use-middlewares', target) ?? [];
      middlewaresMeta.push({
        middleware,
        args: middlewareArgs
      });
      Reflect.defineMetadata('use-middlewares', middlewaresMeta, target);
    }
    // decorator method
    else {
      const [target, name] = args;
      const middlewaresMeta = Reflect.getMetadata('use-middlewares', target.constructor, name) || {};
      if (!middlewaresMeta[name]) {
        middlewaresMeta[name] = [];
      }
      middlewaresMeta[name].push({
        middleware,
        args: middlewareArgs
      });
      Reflect.defineMetadata('use-middlewares', middlewaresMeta, target.constructor, name);
    }
  };
};

/**
 * Alias
 */
export const UseMiddleware = useMiddleware;



