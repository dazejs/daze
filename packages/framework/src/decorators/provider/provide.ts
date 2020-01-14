import { ProviderType } from "../../symbol";

export function Provide(name?: any, isShared = true): MethodDecorator {
  return function (target: object, key: string | symbol) {
    const metaMap: Map<any, ProvideMetaData> = 
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();
    const _name = name ?? key.toString();
    if (metaMap.has(key)) {
      const options = (metaMap.get(key) ?? {}) as ProvideMetaData;
      options.provideName = _name;
      options.isShared = isShared;
      metaMap.set(key, options);
    } else {
      metaMap.set(key, { provideName: _name, isShared });
    }
    Reflect.defineMetadata(ProviderType.PROVIDE, metaMap, target.constructor);
  };
}

export function provide(name?: any, isShared = true): MethodDecorator {
  return Provide(name, isShared);
}

export interface ProvideMetaData {
  provideName?: any;
  isShared?: boolean;
  onMissingProviderkey?: any;
  onConfigKey?: string;
  onProviderKey?: any;
}
