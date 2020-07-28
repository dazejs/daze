/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */
import { INJECTTYPE_METADATA } from '../../symbol';

export interface InjectParamsOption { 
  abstract: any;
  params?: any[];
  handler?: Function;
  index?: number; // 参数的位置信息
}

/**
 * Create a decorator for dependency injection
 * 
 * @param abstract The injection of the key
 * @param params Injection parameters
 * @param handler Post-injection functions that need to manipulate post-injection properties
 */
export function createInjectDecorator(abstract: any, params: any[] = [], handler?: (injectedParam: any) => any) {
  return (target: any, propertyKey?: string | symbol, descriptorOrParameterIndex?: TypedPropertyDescriptor<any> | number) => {
    if (!propertyKey) { // Class
      Reflect.defineMetadata('injectable', true, target);
      const injectors: InjectParamsOption[] = Reflect.getMetadata(INJECTTYPE_METADATA, target) || [];
      Reflect.defineMetadata(INJECTTYPE_METADATA, [
        ...injectors,
        // !!handler ? [abstract, params, handler] : [abstract, params],
        {
          abstract,
          params,
          handler
        }
      ], target);
    } else if (typeof descriptorOrParameterIndex !== 'number') { // Property or Method
      Reflect.defineMetadata('injectable', true, target.constructor);
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
      Reflect.defineMetadata('injectable', true, target.constructor);
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
  
    // if (decoratorParams.length === 1) { // class
    //   const [target] = decoratorParams;
    //   Reflect.defineMetadata('injectable', true, target);
    //   const injectors = Reflect.getMetadata(INJECTTYPE_METADATA, target) || [];
    //   Reflect.defineMetadata(INJECTTYPE_METADATA, [
    //     ...injectors,
    //     !!handler ? [abstract, params, handler] : [abstract, params],
    //   ], target);
    // } else {
    //   const [target, key] = decoratorParams;
    //   Reflect.defineMetadata('injectable', true, target.constructor);
    //   const injectors = Reflect.getMetadata(INJECTTYPE_METADATA, target.constructor, key) || [];
    //   Reflect.defineMetadata(INJECTTYPE_METADATA, [
    //     ...injectors,
    //     !!handler ? [abstract || key, params, handler] : [abstract || key, params],
    //   ], target.constructor, key);
    //   Reflect.defineProperty(target, key, { writable: true });
    // }
  };
}
