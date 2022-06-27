// import { Application } from '../foundation/application';
import * as path from 'path';
import { ProvideMetaData, ProviderOption } from '../decorators';
import { Loader } from '../loader';
import { ProviderType, ProcessType } from '../symbol';
import { ProviderInterface } from '../interfaces';
import { BaseProvider } from '../base';

export class Provider extends BaseProvider {

  async resolve(ProviderClass: Function) {

    if (!ProviderClass || this.app.has(ProviderClass)) return;
    this.app.singleton(ProviderClass, ProviderClass);

    const provideMetaMap: Map<any, ProvideMetaData> = Reflect.getMetadata(ProviderType.PROVIDE, ProviderClass) ?? new Map();
    const providerOptions: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, ProviderClass) ?? {};

    // resolve next depends
    // 优先加载依赖的模块
    if (Array.isArray(providerOptions?.depends)) {
      for (const next of providerOptions.depends) {
        await this.resolve(next);
      }
    }

    if (provideMetaMap.has(ProviderClass) && 
      !this.shouldProvideOnConfig(provideMetaMap.get(ProviderClass))
    ) {
      return ;
    }

    if (await this.needParse(ProviderClass)) {
      const providerInstance = this.app.get(ProviderClass);

      // Compatible with provider hooks
      await this.performRegisterHook(providerInstance);
      this.registerLaunchHook(providerInstance);

      for (const [key, metadata] of provideMetaMap) {
        if (
          this.shouldProvideOnConfig(metadata)
        && this.shouldProvideOnMissingProvider(metadata)
        && this.shouldProvideOnProvider(metadata)
        ) {
          this.app.bind(metadata.provideName, providerInstance[key].bind(providerInstance), metadata.isShared, true);
        }
      }

      // auto scan componentScan
      if (providerOptions?.componentScan) {
        for (const component of providerOptions.componentScan) {
          if (path.isAbsolute(component)) {
            await this.app.get<Loader>('loader').scan(component);
          } else {
            await this.app.get<Loader>('loader').scan(
              path.resolve(this.app.rootPath, component)
            );
          }
        }
      }
    }

    // resolve next imports
    // 最后加载依赖的模块
    if (Array.isArray(providerOptions?.imports)) {
      for (const next of providerOptions.imports) {
        await this.resolve(next);
      }
    }
  }

  /**
   * Perform the register hook
   * @param provider 
   */
  async performRegisterHook(provider: ProviderInterface) {
    if (Reflect.has(provider, 'register') && typeof provider.register === 'function') {
      await provider.register(this.app);
    }
  }

  /**
   * register launch hook to application
   * @param provider 
   */
  registerLaunchHook(provider: ProviderInterface) {
    if (Reflect.has(provider, 'launch') && typeof provider.launch === 'function') {
      this.app.launchCalls.push(() => provider.launch?.(this.app));
    }
  }

  /**
   * should Provide On Config 
   * @param metadata 
   */
  shouldProvideOnConfig(metadata: ProvideMetaData | undefined) {
    if (!metadata || !metadata.onConfigKey) return true;
    return this.app.get('config').has(metadata.onConfigKey);
  }

  /**
   * should Provide On Missing Provider
   * @param metadata 
   */
  shouldProvideOnMissingProvider(metadata: ProvideMetaData) {
    if (!metadata.onMissingProviderkey) return true;
    return !this.app.has(metadata.onMissingProviderkey);
  }

  /**
   * should Provide On Provider
   * @param metadata 
   */
  shouldProvideOnProvider(metadata: ProvideMetaData) {
    if (!metadata.onProviderKey) return true;
    return this.app.has(metadata.onProviderKey);
  }

  async needParse(ProviderClass: any) {
    if (this.app.isCluster) {
      if (this.app.isMaster) {
        if (Reflect.getMetadata(ProcessType.ONLY_MASTER, ProviderClass) || Reflect.getMetadata(ProcessType.APPEND_MASTER, ProviderClass)) {
          return true;
        }
      }
      if (this.app.isAgent) {
        if (Reflect.getMetadata(ProcessType.ONLY_AGENT, ProviderClass) || Reflect.getMetadata(ProcessType.APPEND_AGENT, ProviderClass)) {
          return true;
        }
      }

      if (this.app.isWorker) {
        if (!Reflect.getMetadata(ProcessType.ONLY_MASTER, ProviderClass) && !Reflect.getMetadata(ProcessType.ONLY_AGENT, ProviderClass)) {
          return true;
        }
      }

      return false;
    }
    // 非集群模式全部加载
    else {
      return true;
    }
  }
}
