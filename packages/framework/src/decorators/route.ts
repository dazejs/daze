/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers'
import { ComponentType } from '../symbol'

export function Route(prefix: string = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor.prototype);
    Reflect.defineMetadata('type', ComponentType.Controller, constructor.prototype);
    Reflect.defineMetadata('prefix', formatPrefix(prefix), constructor.prototype);
  };
};
