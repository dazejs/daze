/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { INJECTABLE_KINDS } from '../../symbol'

/**
 * CONSTRUCTOR_INJECTORS
 * [ [ type, params ] ]
 */
export function patchClass(type: string, params: any): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('injectable', true, target.prototype);
    const injectors = Reflect.getMetadata(INJECTABLE_KINDS.CONSTRUCTOR, target.prototype) || [];
    Reflect.defineMetadata(INJECTABLE_KINDS.CONSTRUCTOR, [
      ...injectors,
      [type, params],
    ], target.prototype);
    return target;
  }
};

/**
 * PROPERTY_INJECTORS
 * { [name]: [ type,  params ] }
 */
export function patchProperty(type: string, params: any): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata('injectable', true, target);
    const injectors = Reflect.getMetadata(INJECTABLE_KINDS.PROPERTY, target) || {};
    injectors[propertyKey] = [type, params];
    Reflect.defineMetadata(INJECTABLE_KINDS.PROPERTY, injectors, target);
  }
};

/**
 * METHOD_INJECTORS
 * { [name]: [
 *    [ type,  params ]
 * ] }
 */
export function patchMethod(type: string, params: any): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('injectable', true, target);
    const injectors = Reflect.getMetadata(INJECTABLE_KINDS.METHOD, target) || {};
    const items = injectors[propertyKey] || [];
    items.push([type, params]);
    injectors[propertyKey] = items;
    Reflect.defineMetadata(INJECTABLE_KINDS.METHOD, injectors, target);
    return descriptor;
  }
};
