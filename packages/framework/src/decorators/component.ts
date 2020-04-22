/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function component(name = ''): ClassDecorator {
  return function (constructor) {
    if (!Reflect.hasMetadata('type', constructor)) {
      Reflect.defineMetadata('type', 'component', constructor);
    }
    Reflect.defineMetadata('name', name, constructor);
  };
};
