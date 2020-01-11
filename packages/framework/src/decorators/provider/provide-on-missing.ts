import { DazeProviderType } from "../../symbol";

/**
 *
 *
 *
 *
 */
export function ProvideOnMissing(provider: string | Function): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const metaMap: Map<string | symbol, ProvideOnMissingMetadata> = 
      Reflect.getMetadata(DazeProviderType.PROVIDE_ON_MISSING, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function' || typeof provider === 'undefined') {
      return;
    }
    metaMap.set(key, { missingProvider: provider });
    Reflect.defineMetadata(DazeProviderType.PROVIDE_ON_MISSING, metaMap, target.constructor);
  };
}

export interface ProvideOnMissingMetadata {
  missingProvider: string | Function;
}
