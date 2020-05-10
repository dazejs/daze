/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ProviderType } from '../../symbol';

export interface ProvideMetaData {
  provideName?: any;
  isShared?: boolean;
  onMissingProviderkey?: any;
  onConfigKey?: string;
  onProviderKey?: any;
}

/**
 * To provide services
 * 
 * @param name 
 * @param isShared 
 */
export const provide = function (name?: any, isShared = true): MethodDecorator {
  return function (target: object, key: string | symbol) {
    const metaMap: Map<any, ProvideMetaData> = 
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();
    const _name = name ?? key.toString();
    if (metaMap.has(key)) {
      const options = (metaMap.get(key) ?? {}) as ProvideMetaData;
      options.provideName = _name;
      options.isShared = isShared;
      metaMap.set(key, options);
    } else {
      metaMap.set(key, { provideName: _name, isShared });
    }
    Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
  };
};

/**
 * Alias
 */
export const Provide = provide;


