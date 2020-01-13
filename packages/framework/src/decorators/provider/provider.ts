import { ProviderType } from '../../symbol';
import { Provider as BaseProvider} from '../../base/provider';

export function Depend(providers?: Array<typeof BaseProvider>) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { imports: [] };
    providers?.forEach((p) => {
      if (option.imports?.indexOf(p) === -1) {
        option.imports.push(p);
      }
    });
    Reflect.defineMetadata(ProviderType.PROVIDER, option, constructor);
  };
}
export function depend(providers?: Array<typeof BaseProvider>) {
  return Depend(providers);
}

export function AutoScan(componentScan: string | Array<string>) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, constructor) ?? { imports: [] };
    option.componentScan = componentScan;
    Reflect.defineMetadata(ProviderType.PROVIDER, option ?? {}, constructor);
  };
}
export function autoScan(componentScan: string | Array<string>) {
  return AutoScan(componentScan);
}

/**
 * WIP 
 */
export function Provider(option?: ProviderOption): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata(ProviderType.PROVIDER, option ?? { imports: [] }, constructor);
  };
}

export function provider(option?: ProviderOption): ClassDecorator {
  return Provider(option);
}

export interface ProviderOption {
  imports?: Array<typeof BaseProvider>;
  componentScan?: string | Array<string>;
}
