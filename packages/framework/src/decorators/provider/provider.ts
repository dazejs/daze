/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ProviderType } from '../../symbol';

/**
 * depends providers
 * 
 * @param providers 
 */
export const depends = function (...providers: Function[] | Function[][]) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { depends: [], imports: [], componentScan: [] };

    for (const provider of providers) {
      if (Array.isArray(provider)) {
        option.depends?.push(...provider);
      } else {
        option.depends?.push(provider);
      }
    }
    Reflect.defineMetadata(ProviderType.PROVIDER, option, constructor);
  };
};

/**
 * Alias
 */
export const Depends = depends;

/**
 * imports providers
 * 
 * @param providers 
 */
export const imports = function (...providers: Function[] | Function[][]) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { depends: [], imports: [], componentScan: [] };

    for (const provider of providers) {
      if (Array.isArray(provider)) {
        option.imports?.push(...provider);
      } else {
        option.imports?.push(provider);
      }
    }
    Reflect.defineMetadata(ProviderType.PROVIDER, option, constructor);
  };
};

/**
 * Alias
 */
export const Imports = imports;


/**
 * auto scan components
 * 
 * @param componentScans 
 */
export const autoScan = function (...componentScans: string[] | string[][]) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { depends: [], imports: [], componentScan: [] };

    for (const componentScan of componentScans) {
      if (Array.isArray(componentScan)) {
        option.componentScan?.push(...componentScan);
      } else if (typeof componentScan === 'string') {
        option.componentScan?.push(componentScan);
      }
    }
   
    Reflect.defineMetadata(ProviderType.PROVIDER, option ?? {}, constructor);
  };
};

export const AutoScan = autoScan;

export const provider = function (providerOption?: ProviderOption): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('type', 'provider', constructor);
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { depends: [], imports: [], componentScan: [] };
    if (providerOption?.depends) {
      for (const depend of providerOption.depends) {
        if (Array.isArray(depend)) {
          option.depends?.push(...depend);
        } else {
          option.depends?.push(depend);
        }
      }
    }
    if (providerOption?.imports) {
      for (const imports of providerOption.imports) {
        if (Array.isArray(imports)) {
          option.imports?.push(...imports);
        } else {
          option.imports?.push(imports);
        }
      }
    }
    if (providerOption?.componentScan) {
      for (const componentScan of providerOption.componentScan) {
        if (Array.isArray(componentScan)) {
          option.componentScan?.push(...componentScan);
        } else if (typeof componentScan === 'string') {
          option.componentScan?.push(componentScan);
        }
      }
    }
    Reflect.defineMetadata(ProviderType.PROVIDER, option ?? {}, constructor);
  };
};

export const Provider = provider;


export interface ProviderOption {
  depends?: Function[];
  imports?: Function[];
  componentScan?: string[];
}
