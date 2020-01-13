import { ProviderType } from '../../symbol';
import { ProvideMetaData } from './provide';


export function ProvideOnMissing(provider: string | Function): MethodDecorator {
  return function (target: object, name: string | symbol) {
    const metaMap: Map<string | symbol, ProvideMetaData> = 
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();
    if (metaMap.has(name)) {
      const options = (metaMap.get(name) ?? {}) as ProvideMetaData;
      options.onMissingProviderkey = provider;
      metaMap.set(name, options);
    } else {
      metaMap.set(name, { onMissingProviderkey: provider });
    }
    Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
  };
}

export function provideOnMissing(provider: string | Function): MethodDecorator {
  return ProvideOnMissing(provider);
}