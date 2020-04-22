/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function componentType(type: any): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('type', type, constructor);
    return constructor;
  };
};