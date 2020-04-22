/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function middleware(name = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', 'middleware', constructor);
  };
};