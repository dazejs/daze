import { Application } from '../foundation/application';
import * as path from 'path';
import { ProvideMetaData, ProviderOption } from '../decorators';
import { Loader } from '../loader';
import { ProviderType, ProcessType } from '../symbol';
import { ProviderInterface } from '../interfaces';
export class Provider {

  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  /**
     * 解析提供者
     * @param ProviderClass
     */
  async resolve(ProviderClass: any) {
    //  已经加载过相同模块就不再加载
    if (!ProviderClass || this.app.has(ProviderClass)) return;
    // 加载模块到容器中
    this.app.singleton(ProviderClass, ProviderClass);

    const provideMetaMap: Map<any, ProvideMetaData> = Reflect.getMetadata(ProviderType.PROVIDE, ProviderClass) ?? new Map();
    const providerOptions: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, ProviderClass) ?? {};
    // 优先加载依赖的模块
    if (Array.isArray(providerOptions?.depends)) {
      for (const next of providerOptions.depends) {
        await this.resolve(next);
      }
    }

    if (provideMetaMap.has(ProviderClass) && !this.shouldProvideOnConfig(provideMetaMap.get(ProviderClass))
    ) {
      return ;
    }
    if (await this.needParse(ProviderClass)) {
      const providerInstance = this.app.get(ProviderClass);

      // 执行服务提供者的 hook 钩子函数
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

      // 自动扫描目录
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

    // 最后加载额外依赖的模块
    if (Array.isArray(providerOptions?.imports)) {
      for (const next of providerOptions.imports) {
        await this.resolve(next);
      }
    }
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

  /**
     * Perform the register hook
     * @param provider
     */
  async performRegisterHook(provider: ProviderInterface) {
    if (Reflect.has(provider, 'register') && typeof provider.register === 'function') {
      await (provider.register as any)(this.app);
    }
  }

  /**
     * register launch hook to application
     * @param provider
     */
  registerLaunchHook(provider: ProviderInterface) {
    if (Reflect.has(provider, 'launch') && typeof provider.launch === 'function') {
      this.app.launchCalls.push(() => (provider.launch as any)?.(this.app));
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
}
