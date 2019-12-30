import { Application } from "../foundation/application";
import { DazeModuleType } from "../symbol";
import { BeanMetaData } from "./bean.decorator";

export interface DazeAutoModule {
  empty(): void;
}

export class DazeAutoModuleConfigure {
  private app: Application;
  
  constructor(app: Application) {
    this.app = app;
  }
  
  config(module: DazeAutoModule | any) {
    if (!module) {
      return;
    }
    // Get module options
    const moduleOptions = Reflect.getMetadata(DazeModuleType.MODULES, module);
    if (!moduleOptions) {
      return;
    }
    // Get bean methods
    const beanMetaMap: Map<string | symbol, BeanMetaData> = Reflect.getMetadata(DazeModuleType.BEAN, module) ?? new Map();
    if (beanMetaMap.size == 0) {
      return;
    }
    beanMetaMap.forEach((meta) => {
      const { name, key, method } = meta;
      const bean = method.call(module);
      console.log(`${name}#${key.toString()}`);
      this.app.singleton(bean.constructor, bean);
    });
  }
  
}