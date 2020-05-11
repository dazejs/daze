/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

/**
 * component metadata
 * @param name 
 */
export const component = function (name = ''): ClassDecorator {
  return function (constructor) {
    if (!Reflect.hasMetadata('type', constructor)) {
      Reflect.defineMetadata('type', 'component', constructor);
    }
    Reflect.defineMetadata('name', name, constructor);
  };
};

/**
 * Alias
 */
export const Component = component;

