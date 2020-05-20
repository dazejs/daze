/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * use middleware on controller
 * 
 * @param middleware 
 */
export const useMiddleware = function (middleware: any) {
  return function (...args: any[]) {
    // decorator class
    if (args.length === 1) {
      const [target] = args;
      const middlewares = Reflect.getMetadata('controllerMiddlewares', target) || [];
      middlewares.push(middleware);
      Reflect.defineMetadata('controllerMiddlewares', middlewares, target);
    }
    // decorator method
    else {
      const [target, name] = args;
      const middlewares = Reflect.getMetadata('routeMiddlewares', target.constructor) || {};
      if (!middlewares[name]) {
        middlewares[name] = [];
      }
      middlewares[name].push(middleware);
      Reflect.defineMetadata('routeMiddlewares', middlewares, target.constructor);
    }
  };
};

/**
 * Alias
 */
export const UseMiddleware = useMiddleware;



