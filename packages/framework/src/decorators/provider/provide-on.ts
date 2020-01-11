import { DazeProviderType } from "../../symbol";

/**
 *
 *
 *
 *
 */

export function ProvideOn(provider: string | Function): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const metaMap: Map<string | symbol, ProvideOnMetadata> =
      Reflect.getMetadata(DazeProviderType.PROVIDE_ON, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function' || typeof provider === 'undefined') {
      return;
    }
    metaMap.set(key, { provider: provider });
    Reflect.defineMetadata(DazeProviderType.PROVIDE_ON, metaMap, target.constructor);
  };
}

export interface ProvideOnMetadata {
  provider: string | Function;
}
