/* eslint-disable @typescript-eslint/ban-types */
/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ProviderType } from '../../symbol';
import { ProvideMetaData } from './provide';

/**
 * Provides the service when the specified configuration item exists
 * 
 * @param key 
 */
export const ProvideOnConfig = function (key: string): ClassDecorator | MethodDecorator | any {
  return function (
    target: Function | object, 
    name?: string | symbol | undefined,
    descriptor?: TypedPropertyDescriptor<any> | undefined,
  ) {
    // Decorator on method
    if (!!name && !!descriptor) {
      const metaMap: Map<any, ProvideMetaData> = 
        Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();
      if (metaMap.has(name)) {
        const options = (metaMap.get(name) ?? {}) as ProvideMetaData;
        options.onConfigKey = key;
        metaMap.set(name, options);
      } else {
        metaMap.set(name, { onConfigKey: key });
      }
      Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
    }
    // Decorator on class
    else {
      const metaMap: Map<any, ProvideMetaData> = 
        Reflect.getMetadata(ProviderType.PROVIDE, target) ?? new Map();
      if (metaMap.has(target)) {
        const options = (metaMap.get(target) ?? {}) as ProvideMetaData;
        options.onConfigKey = key;
        metaMap.set(target, options);
      } else {
        metaMap.set(target, { onConfigKey: key });
      }
      Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target);
    }
  };
};
