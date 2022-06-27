/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { ProviderType, ProcessType } from '../../symbol';

/**
 * depends providers
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
export const Depends = depends;

/**
 * imports providers
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
export const Imports = imports;


/**
 * auto scan components
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

/**
 * provider Type
 */
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


/**
 * loaded only in the Agent process
 */
export const onlyAgent = function (): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata(ProcessType.ONLY_AGENT, true, constructor);
  };
};
export const OnlyAgent = onlyAgent;

/**
 * also loaded in the Agent process
 */ 
export const appendAgent = function (): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata(ProcessType.APPEND_AGENT, true, constructor);
  };
};
export const AppendAgent = appendAgent;

/**
 * loaded only in the Agent process
 */
export const onlyMaster = function (): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata(ProcessType.ONLY_MASTER, true, constructor);
  };
};
export const OnlyMaster = onlyMaster;

/**
 * also loaded in the Agent process
 */
export const appendMaster = function (): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata(ProcessType.APPEND_MASTER, true, constructor);
  };
};
export const AppendMaster = appendMaster;


export interface ProviderOption {
  depends?: Function[];
  imports?: Function[];
  componentScan?: string[];
}
