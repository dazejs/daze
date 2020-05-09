/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * set type for component
 * @param type 
 */
export const componentType = function (type: any): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('type', type, constructor);
    return constructor;
  };
};

/**
 * Alias
 */
export const ComponentType = componentType;