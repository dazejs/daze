/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ComponentType } from '../symbol'

export function Component(name: string = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor.prototype);
    if (!Reflect.hasMetadata('type', constructor.prototype)) {
      Reflect.defineMetadata('type', ComponentType.Component, constructor.prototype);
    }
    Reflect.defineMetadata('name', name, constructor.prototype);
  };
};
