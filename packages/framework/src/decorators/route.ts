/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers';
import { ComponentType } from '../symbol';

export function Route(prefix = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('type', ComponentType.Controller, constructor);
    Reflect.defineMetadata('prefix', formatPrefix(prefix), constructor);
  };
};
