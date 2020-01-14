import { ProviderType } from "../../symbol";

export function Provide(name?: any, isShared = true): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const provideMetaMap: Map<any, ProvideMetaData> = 
      Reflect.getMetadata(ProviderType.PROVIDE, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function') {
      return;
    }
    const _name = name ?? key.toString();
    provideMetaMap.set(key, { provideName: _name, isShared });
    Reflect.defineMetadata(ProviderType.PROVIDE, provideMetaMap, target.constructor);
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
