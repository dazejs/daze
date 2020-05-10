/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ProviderType } from '../../symbol';
import { ProvideMetaData } from './provide';

/**
 * Provide a service when no specified service exists
 * 
 * @param provider 
 */
export const provideOnMissing = function (provider: string | Function): MethodDecorator {
  return function (target: object, name: string | symbol) {
    const metaMap: Map<string | symbol, ProvideMetaData> = 
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();
    if (metaMap.has(name)) {
      const options = (metaMap.get(name) ?? {}) as ProvideMetaData;
      options.onMissingProviderkey = provider;
      metaMap.set(name, options);
    } else {
      metaMap.set(name, { onMissingProviderkey: provider });
    }
    Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
  };
};

/**
 * Alias
 */
export const ProvideOnMissing = provideOnMissing;