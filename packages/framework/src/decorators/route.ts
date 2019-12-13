/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ComponentType } from '../symbol';
import { formatPrefix } from './helpers';

export function Route(prefix = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('type', ComponentType.Controller, constructor);
    Reflect.defineMetadata('prefix', formatPrefix(prefix), constructor);
  };
};

export function route(prefix = ''): ClassDecorator {
  return Route(prefix);
};
