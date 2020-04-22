/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function resource(name = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', 'resource', constructor);
  };
};