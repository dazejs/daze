import { DazeModuleType } from "../symbol";

export interface ModuleOption {
  imports: Array<Function>;
  componentScan: string | Array<string>;
}

export function Module(option: ModuleOption): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata(DazeModuleType.MODULES, option, constructor);
  };
}
