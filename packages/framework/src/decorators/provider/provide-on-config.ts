import { DazeProviderType } from "../../symbol";

/**
 *
 *
 *
 *
 */
export function ProvideOnConfig(key: string): ClassDecorator | MethodDecorator | any {
  return function (
    target: Function | object, 
    name?: string | symbol | undefined,
    descriptor?: TypedPropertyDescriptor<any> | undefined,
  ) {
    // Decorator on method
    if (!!name && !!descriptor) {
      const metaMap: Map<any, ProvideOnConfigMetadata> = 
        Reflect.getMetadata(DazeProviderType.PROVIDE_ON_CONFIG, target.constructor) ?? new Map();
      metaMap.set(name, { configKey: key });
      Reflect.defineMetadata(DazeProviderType.PROVIDE_ON_CONFIG, metaMap, target.constructor);
    }
    // Decorator on class
    else {
      const metaMap: Map<any, ProvideOnConfigMetadata> = 
        Reflect.getMetadata(DazeProviderType.PROVIDE_ON_CONFIG, target) ?? new Map();
      metaMap.set(target, { configKey: key });
      Reflect.defineMetadata(DazeProviderType.PROVIDE_ON_CONFIG, metaMap, target);
    }
  };
}

export interface ProvideOnConfigMetadata {
  configKey: string;
}
