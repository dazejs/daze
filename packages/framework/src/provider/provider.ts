import { Application } from '@src';
import { Provider as BaseProvider } from '../base/provider';
import { ProvideMetaData, ProviderOption } from '../decorators/provider';
import { ProviderType } from '../symbol';
import { Loader } from '../loader';


/**
 * Support provider resolver
 */
export class Provider {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async resolve(ProviderClass: typeof BaseProvider) {

    if (!ProviderClass || this.app.has(ProviderClass)) return;
    
    this.app.singleton(ProviderClass, ProviderClass);
    // Get provider options
    // Class should be decorated by @Provider
    const providerOptions: ProviderOption = Reflect.getMetadata(ProviderType.PROVIDER, ProviderClass) ?? {};

    const providerInstance = this.app.get(ProviderClass);

    // Compatible with provider hooks
    await this.performRegisterHook(providerInstance);
    this.registerLaunchHook(providerInstance);

   

    const provideMetaMap: Map<any, ProvideMetaData> = Reflect.getMetadata(ProviderType.PROVIDE, ProviderClass) ?? new Map();

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
        await this.app.get<Loader>('loader').scan(component);
      }
    }

    // resolve next imports
    if (providerOptions?.imports) {
      for (const next of providerOptions.imports) {
        await this.resolve(next);
      }
    }
  }

  /**
   * Perform the register hook
   * @param provider 
   */
  async performRegisterHook(provider: BaseProvider) {
    if (Reflect.has(provider, 'register') && typeof provider.register === 'function') {
      await provider.register();
    }
  }

  /**
   * register launch hook to application
   * @param provider 
   */
  registerLaunchHook(provider: BaseProvider) {
    if (Reflect.has(provider, 'launch') && typeof provider.launch === 'function') {
      this.app.launchCalls.push(() => provider.launch?.());
    }
  }

  /**
   * should Provide On Config 
   * @param metadata 
   */
  shouldProvideOnConfig(metadata: ProvideMetaData) {
    if (!metadata.onConfigKey) return true;
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
