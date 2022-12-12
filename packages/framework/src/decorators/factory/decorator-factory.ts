/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */
import { INJECTTYPE_METADATA, INJECTABLE } from '../../symbol';

export interface InjectParamsOption { 
  abstract: any;
  params?: any[];
  handler?: (...args: any[]) => any;
  index?: number; // 参数的位置信息
}

/**
 * Create a decorator for dependency injection
 * 
 * @param abstract The injection of the key
 * @param params Injection parameters
 * @param handler Post-injection functions that need to manipulate post-injection properties
 */
export function decoratorFactory(abstract: any, params: any[] = [], handler?: (injectedParam: any) => any) {
  return (target: any, propertyKey?: string | symbol, descriptorOrParameterIndex?: TypedPropertyDescriptor<any> | number) => {
    if (!propertyKey) { // Class
      Reflect.defineMetadata(INJECTABLE, true, target);
      const injectors: InjectParamsOption[] = Reflect.getMetadata(INJECTTYPE_METADATA, target) || [];
      Reflect.defineMetadata(INJECTTYPE_METADATA, [
        ...injectors,
        {
          abstract,
          params,
          handler
        }
      ], target);
    } else if (typeof descriptorOrParameterIndex !== 'number') { // Property or Method
      Reflect.defineMetadata(INJECTABLE, true, target.constructor);
      const injectors: InjectParamsOption[] = Reflect.getMetadata(INJECTTYPE_METADATA, target.constructor, propertyKey) || [];
      Reflect.defineMetadata(INJECTTYPE_METADATA, [
        ...injectors,
        {
          abstract: abstract || propertyKey,
          params,
          handler
        }
      ], target.constructor, propertyKey);
      Reflect.defineProperty(target.constructor, propertyKey, { writable: true });
    } else {  // Paramer
      Reflect.defineMetadata(INJECTABLE, true, target.constructor);
      const injectors: InjectParamsOption[] = Reflect.getMetadata(INJECTTYPE_METADATA, target.constructor, propertyKey) || [];
      Reflect.defineMetadata(INJECTTYPE_METADATA, [
        ...injectors,
        {
          abstract: abstract || propertyKey,
          params,
          handler,
          index: descriptorOrParameterIndex
        }
      ], target.constructor, propertyKey);
      Reflect.defineProperty(target.constructor, propertyKey, { writable: true });
    }
  };
}
