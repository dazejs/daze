/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ProviderType } from '../../symbol';
import { ProvideMetaData } from './provide';

/**
 * Provides a service when a specified service exists
 * 
 * @param provider 
 */
export const provideOn = function (provider: string | Function): MethodDecorator {
  return function (target: object, key: string | symbol) {
    const metaMap: Map<string | symbol, ProvideMetaData> =
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();

    if (metaMap.has(key)) {
      const options = (metaMap.get(key) ?? {}) as ProvideMetaData;
      options.onProviderKey = provider;
      metaMap.set(key, options);
    } else {
      metaMap.set(key, { onProviderKey: provider });
    }
    Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
  };
};

/**
 * Alias
 */
export const ProvideOn = provideOn;
