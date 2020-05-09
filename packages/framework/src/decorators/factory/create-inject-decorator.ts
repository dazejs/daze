/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

export function createInjectDecorator(abstract: any, params: any[] = [], handler?: (injectedParam: any) => any) {
  // return (...args: any[]) => (...argsClass: any[])  => handle(argsClass, args, type, handler);
  return function (...decoratorParams: any[]) {
    if (decoratorParams.length === 1) { // class
      const [target] = decoratorParams;
      Reflect.defineMetadata('injectable', true, target);
      const injectors = Reflect.getMetadata('injectparams', target) || [];
      Reflect.defineMetadata('injectparams', [
        ...injectors,
        !!handler ? [abstract, params, handler] : [abstract, params],
      ], target);
    } else {
      const [target, key] = decoratorParams;
      Reflect.defineMetadata('injectable', true, target.constructor);
      const injectors = Reflect.getMetadata('injectparams', target.constructor, key) || [];
      Reflect.defineMetadata('injectparams', [
        ...injectors,
        !!handler ? [abstract || key, params, handler] : [abstract || key, params],
      ], target.constructor, key);
      Reflect.defineProperty(target, key, { writable: true });
    }
  };
}
