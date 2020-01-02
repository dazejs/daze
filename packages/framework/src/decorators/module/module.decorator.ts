import { DazeModuleType } from "../../symbol";
import { DazeAutoModule } from "../../foundation/auto-module";

export interface ModuleOption {
  imports?: Array<DazeAutoModule | Function>;
  componentScan?: string | Array<string>;
}

export function Module(option?: ModuleOption): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata(DazeModuleType.MODULES, option ?? {}, constructor);
  };
}
