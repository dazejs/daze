import { ProviderType } from '../../symbol';
import { ProvideMetaData } from './provide';

export function provideOn(provider: string | Function): MethodDecorator {
  return function (target: object, key: string | symbol) {
    const metaMap: Map<string | symbol, ProvideMetaData> =
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();

    if (metaMap.has(key)) {
      const options = (metaMap.get(key) ?? {}) as ProvideMetaData;
      options.onProviderKey = provider;
      metaMap.set(key, options);
    } else {
      metaMap.set(key, { onProviderKey: provider });
    }
    Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
  };
}
