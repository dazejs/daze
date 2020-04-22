import { ProviderType } from '../../symbol';

export function depend(...providers: Function[] | Function[][]) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { depends: [], componentScan: [] };

    for (const provider of providers) {
      if (Array.isArray(provider)) {
        option.depends?.push(...provider);
      } else {
        option.depends?.push(provider);
      }
    }
    Reflect.defineMetadata(ProviderType.PROVIDER, option, constructor);
  };
}
export function depends(...providers: Function[] | Function[][]) {
  return depend(...providers);
}

export function autoScan(...componentScans: string[] | string[][]) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { depends: [], componentScan: [] };

    for (const componentScan of componentScans) {
      if (Array.isArray(componentScan)) {
        option.componentScan?.push(...componentScan);
      } else if (typeof componentScan === 'string') {
        option.componentScan?.push(componentScan);
      }
    }
   
    Reflect.defineMetadata(ProviderType.PROVIDER, option ?? {}, constructor);
  };
}


export interface ProviderOption {
  depends?: Function[];
  componentScan?: string[];
}
