import { DazeProviderType } from "../../symbol";

export function Provide(name?: string): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const provideMetaMap: Map<any, ProvideMetaData> = 
      Reflect.getMetadata(DazeProviderType.PROVIDE, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function') {
      return;
    }
    const _name = name ?? key.toString();
    provideMetaMap.set(key, { provideName: _name });
    Reflect.defineMetadata(DazeProviderType.PROVIDE, provideMetaMap, target.constructor);
  };
}

export function provide(name?: string): MethodDecorator {
  return Provide(name);
}

export interface ProvideMetaData {
  provideName: string;
}
