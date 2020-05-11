/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

export const crossOrigin = function (options: any = {}) {
  return function (...args: any[]) {
    // class decorator
    if (args.length === 1) {
      const [target] = args;
      Reflect.defineMetadata('controllerCrossOrigin', {
        ...options,
      }, target);
    }
    // method decorator
    else {
      const [target, name] = args;
      const corses = Reflect.getMetadata('routeCrossOrigin', target.constructor) || {};
      corses[name] = {
        ...options,
      };
      Reflect.defineMetadata('routeCrossOrigin', corses, target.constructor);
    }
  };
};
export const CrossOrigin = crossOrigin;
