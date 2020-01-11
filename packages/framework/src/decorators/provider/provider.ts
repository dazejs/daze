import { DazeProviderType } from "../../symbol";
import { DazeProvider } from "../../foundation/provider-resolver";

export function Provider(option?: ProviderOption): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata(DazeProviderType.PROVIDER, option ?? {}, constructor);
  };
}

export interface ProviderOption {
  imports?: Array<DazeProvider | Function>;
  componentScan?: string | Array<string>;
}
