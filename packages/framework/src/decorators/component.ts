/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function Component(name = ''): ClassDecorator {
  return function (constructor) {
    // Reflect.defineMetadata('injectable', true, constructor);
    if (!Reflect.hasMetadata('type', constructor)) {
      Reflect.defineMetadata('type', 'component', constructor);
    }
    Reflect.defineMetadata('name', name, constructor);
  };
};

export function component(name = '') {
  return Component(name);
}
