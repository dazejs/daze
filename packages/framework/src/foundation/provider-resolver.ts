import { Application } from "@src";
import { DazeProviderType } from "../symbol";
import {
  ProvideMetaData,
  ProvideOnConfigMetadata,
  ProvideOnMetadata,
  ProvideOnMissingMetadata
} from "../decorators/provider";

export interface DazeProvider {
  empty(): void;
}

/**
 * Support provider resolver
 */
export class DazeProviderResolver {
  private app: Application;

  /**
   * Modules config has been init
   */
  private hasInitModules: Array<DazeProvider | Function> = [];

  constructor(app: Application) {
    this.app = app;
  }

  config(provider: DazeProvider | Function) {
    if (!provider || this.hasInitModules.indexOf(provider) != -1) {
      return;
    }
    this.hasInitModules.push(provider);

    // Get provider options
    // Class should be decorated by @Provider
    const providerOptions = Reflect.getMetadata(DazeProviderType.PROVIDER, provider);
    if (!providerOptions) {
      return;
    }

    // Get provide config on class
    const provideOnConfigMetaMap: Map<any, ProvideOnConfigMetadata> = Reflect.getMetadata(DazeProviderType.PROVIDE_ON_CONFIG, provider) ?? new Map();
    const provideOnConfigClass = provideOnConfigMetaMap.get(provider);
    if (!!provideOnConfigClass) {
      const provideOnConfigClassConfig = this.app.config.get(provideOnConfigClass.configKey);
      if (provideOnConfigClassConfig === null || typeof provideOnConfigClassConfig === 'undefined') {
        return;
      }
    }

    // TODO: handle inject dependence
    // handle config
    const that = this;
    const providerInstance = Reflect.construct(provider as Function, []);
    const providerProxy = new Proxy(providerInstance, new class implements ProxyHandler<DazeProvider | Function> {
      get(target: any, name: string | number | symbol, receiver: any): any {
        if (typeof target[name] === 'function') {
          return new Proxy(target[name], {
            apply(_target: any | Function, _thisArg: any, _argArray?: any): any {
              // 1. check config
              const _provideOnConfigMetaMap: Map<any, ProvideOnConfigMetadata> =
                Reflect.getMetadata(DazeProviderType.PROVIDE_ON_CONFIG, target.constructor) ?? new Map();
              const provideOnConfigProperty = _provideOnConfigMetaMap.get(name);
              if (!!provideOnConfigProperty) {
                const provideOnConfigPropertyConfig = that.app.config.get(provideOnConfigProperty.configKey);
                if (provideOnConfigPropertyConfig === null || typeof provideOnConfigPropertyConfig === 'undefined') {
                  return undefined;
                }
              }
              // 2. check provide on missing
              const _provideOnMissingMetaMap: Map<any, ProvideOnMissingMetadata> =
                Reflect.getMetadata(DazeProviderType.PROVIDE_ON_MISSING, target.constructor) ?? new Map();
              const provideOnMissingProperty = _provideOnMissingMetaMap.get(name);
              if (!!provideOnMissingProperty) {
                const missingProvider = that.app.get(provideOnMissingProperty.missingProvider);
                // if exists, just return
                if (missingProvider !== null && typeof missingProvider !== 'undefined') {
                  return undefined;
                }
              }
              
              // 3. check provide on
              const _provideOnMetaMap: Map<any, ProvideOnMetadata> =
                Reflect.getMetadata(DazeProviderType.PROVIDE_ON, target.constructor) ?? new Map();
              const provideOnProperty = _provideOnMetaMap.get(name);
              if (!!provideOnProperty) {
                const onProvider = that.app.get(provideOnProperty.provider);
                // if not exists, just return
                if (onProvider === null || typeof onProvider === 'undefined') {
                  return undefined;
                }
              }
              
              return Reflect.apply(_target, _thisArg, _argArray);
            }
          });
        }
        const config = Reflect.getMetadata('injectparams', target.constructor, name.toString());
        let result = Reflect.get(target, name, receiver);
        if (!!config) {
          for (const [type, params = [], handler] of config) {
            switch (type) {
              case 'config':
                const value = handler ? handler(that.app.config) : that.app.config.get(params[0]);
                if (value !== null && typeof value !== 'undefined') {
                  result = value;
                }
                break;
              default:
                break;
            }
          }
        }
        return result;
      }
    });
    this.app.singleton(provider, providerProxy);

    // Get provide methods
    const provideMetaMap: Map<any, ProvideMetaData> = Reflect.getMetadata(DazeProviderType.PROVIDE, provider) ?? new Map();
    provideMetaMap.forEach((metadata, key) => {
      const { provideName } = metadata;
      const provide = providerProxy[key].apply(providerProxy);
      if (provide !== null && typeof provide !== 'undefined') {
        this.app.singleton(provide.constructor, provide);
        this.app.singleton(provideName, provide);
      }
    });

    // Resolve next modules
    providerOptions?.imports?.forEach((next: Function | DazeProvider) => {
      this.config(next);
    });
  }

}
