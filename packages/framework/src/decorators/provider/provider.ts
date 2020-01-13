import { DazeProviderType } from "../../symbol";
import { DazeProvider } from "../../foundation/provider-resolver";

export function Depend(providers?: Array<DazeProvider | Function>) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(DazeProviderType.PROVIDER, constructor) ?? { imports: [] };
    providers?.forEach((p) => {
      if (option.imports?.indexOf(p) === -1) {
        option.imports.push(p);
      }
    });
    Reflect.defineMetadata(DazeProviderType.PROVIDER, option, constructor);
  };
}
export function depend(providers?: Array<DazeProvider | Function>) {
  return Depend(providers);
}

export function AutoScan(componentScan: string | Array<string>) {
  return function (constructor: Function) {
    const option: ProviderOption = Reflect.getMetadata(DazeProviderType.PROVIDER, constructor) ?? { imports: [] };
    option.componentScan = componentScan;
    Reflect.defineMetadata(DazeProviderType.PROVIDER, option ?? {}, constructor);
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
    Reflect.defineMetadata(DazeProviderType.PROVIDER, option ?? { imports: [] }, constructor);
  };
}

export function provider(option?: ProviderOption): ClassDecorator {
  return Provider(option);
}

export interface ProviderOption {
  imports?: Array<DazeProvider | Function>;
  componentScan?: string | Array<string>;
}
