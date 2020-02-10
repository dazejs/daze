import { ProviderType } from '../../symbol';
import { Provider as BaseProvider} from '../../base/provider';

export function Depend(...providers: (typeof BaseProvider)[] | (typeof BaseProvider)[][]) {
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
export function depend(...providers: (typeof BaseProvider)[] | (typeof BaseProvider)[][]) {
  return Depend(...providers);
}

export function AutoScan(...componentScans: string[] | string[][]) {
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
export function autoScan(...componentScans: string[] | string[][]) {
  return AutoScan(...componentScans);
}

export interface ProviderOption {
  depends?: (typeof BaseProvider)[];
  componentScan?: string[];
}
