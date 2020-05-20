/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { injectable } from './injectable';

/**
 * component metadata
 * @param name
 * @param type
 */
export const component = function (name?: string, type = 'component'): ClassDecorator {
  return function (constructor) {
    injectable(constructor);
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', type, constructor);
  };
};

/**
 * Alias
 */
export const Component = component;

