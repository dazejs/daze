import { Application } from "@src";
import { DazeModuleType } from "../symbol";
import { ProvideMetaData } from "@src";

export interface DazeAutoModule {
  empty(): void;
}

/**
 * Support auto module config 
 */
export class DazeAutoModuleConfigure {
  private app: Application;

  /**
   * Modules config has been init
   */
  private hasInitModules: Array<DazeAutoModule | Function> = [];
  
  constructor(app: Application) {
    this.app = app;
  }
  
  config(module: DazeAutoModule | Function) {
    if (!module || this.hasInitModules.indexOf(module) != -1) {
      return;
    }
    this.hasInitModules.push(module);
    
    // Get module options
    // class should be decorated by @Module
    const moduleOptions = Reflect.getMetadata(DazeModuleType.MODULES, module);
    if (!moduleOptions) {
      return;
    }
    
    // Get provide config
    const provideOnConfigMetaMap: Map<any, ProvideMetaData> = Reflect.getMetadata(DazeModuleType.PROVIDE_ON_CONFIG, module) ?? new Map();
    const provideOnConfigClass = provideOnConfigMetaMap.get(module);
    if (!!provideOnConfigClass) {
      const provideOnConfigClassConfig = this.app.config.get(provideOnConfigClass.key as string);
      if (provideOnConfigClassConfig === null || typeof provideOnConfigClassConfig === 'undefined') {
        return;
      }
    }
    
    // TODO: handle inject dependence
    // handle config
    const moduleObj = new (module as any)();
    Object.keys(moduleObj).forEach((key) => {
      const config = Reflect.getMetadata('injectparams', module, key);
      if (!!config) {
        for (const [type, params = []] of config) {
          switch (type) {
            case 'config':
              const value = this.app.config.get(params[0]);
              if (value != null && typeof value !== 'undefined') {
                moduleObj[key] = value;
              }
              break;
            default:
              break;
          }
        }
      }
    });
    this.app.singleton(module, moduleObj);

    // Get provide methods
    const provideMetaMap: Map<string | symbol, ProvideMetaData> = Reflect.getMetadata(DazeModuleType.PROVIDES, module) ?? new Map();
    provideMetaMap.forEach((metadata) => {
      const { name, key, method } = metadata;
      const provide = method.call(moduleObj);
      this.app.singleton(provide.constructor, provide);
      this.app.singleton(name ?? key.toString(), provide);
    });
    // Resolve next modules
    moduleOptions?.imports?.forEach((next: Function | DazeAutoModule) => {
      this.config(next);
    });
  }
  
}
