import { DazeModuleType } from "../symbol";

export class BeanMetaData {
  name?: string;
  key: string | symbol;
  method: () => any; // TODO: support inject

  constructor(key: string | symbol, method: any, name?: string) {
    this.name = name;
    this.key = key;
    this.method = method;
  }
}

export function Bean(name?: string): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const beanMetaMap: Map<string | symbol, BeanMetaData> = Reflect.getMetadata(DazeModuleType.BEAN, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function') {
      return;
    }
    beanMetaMap.set(key, new BeanMetaData(key, method, name));
    Reflect.defineMetadata(DazeModuleType.BEAN, beanMetaMap, target.constructor);
  };
}

