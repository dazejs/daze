/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export const middleware = function (name = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', 'middleware', constructor);
  };
};

export const Middleware = middleware;