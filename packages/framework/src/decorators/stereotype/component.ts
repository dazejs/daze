/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { Injectable } from './injectable';

/**
 * component metadata
 * @param name
 * @param type
 */
export const Component = function (name?: string, type = 'component'): ClassDecorator {
  return function (constructor) {
    Injectable(constructor);
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', type, constructor);
  };
};