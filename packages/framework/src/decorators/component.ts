/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ComponentType } from '../symbol';

export function Component(name = ''): ClassDecorator {
  return function (constructor) {
    // Reflect.defineMetadata('injectable', true, constructor);
    if (!Reflect.hasMetadata('type', constructor)) {
      Reflect.defineMetadata('type', ComponentType.Component, constructor);
    }
    Reflect.defineMetadata('name', name, constructor);
  };
};

export function component(name = '') {
  return Component(name);
}
