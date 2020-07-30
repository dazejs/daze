/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

// import { injectable } from './injectable';
// import { PARAMTYPES_METADATA } from '../../symbol';

// /**
//  * 根据 Reflect 反射获取 design:paramtypes 参数类型
//  * @param constructor 
//  */
// function patchMethodParamtypes<TFunction extends Function>(constructor: TFunction) { 
//   const keys = Reflect.ownKeys(constructor.prototype);
  
//   for (const key of keys) {
//     if (typeof key === 'string' && key !== 'name' && key !== 'constructor' && typeof constructor.prototype[key] === 'function') { 
//       const paramtypes = Reflect.getMetadata('design:paramtypes', constructor.prototype, key);
//       Reflect.defineMetadata(PARAMTYPES_METADATA, paramtypes, constructor.prototype, key);
//     }
//   }
// }

// function patchConstructorParamtypes<TFunction extends Function>(constructor: TFunction) { 
//   const paramtypes = Reflect.getMetadata('design:paramtypes', constructor.prototype);
//   Reflect.defineMetadata(PARAMTYPES_METADATA, paramtypes, constructor.prototype);
// }


/**
 * component metadata
 * @param name
 * @param type
 */
export const component = function (name?: string, type = 'component'): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('name', name, constructor);
    Reflect.defineMetadata('type', type, constructor);
    // patchConstructorParamtypes(constructor);
    // patchMethodParamtypes(constructor);
  };
};

/**
 * Alias
 */
export const Component = component;

