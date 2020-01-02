import { DazeModuleType } from "../../symbol";

export class ProvideMetaData {
  name?: string | Function;
  key: string | symbol;
  target?: object;
  method: () => any; // TODO: support inject

  constructor(key: string | symbol, method: any, target?: object, name?: string | Function) {
    this.name = name;
    this.key = key;
    this.target = target;
    this.method = method;
  }
}

export function Provide(name?: string): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const provideMetaMap: Map<string | symbol, ProvideMetaData> = Reflect.getMetadata(DazeModuleType.PROVIDES, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function') {
      return;
    }
    provideMetaMap.set(key, new ProvideMetaData(key, method, target, name));
    Reflect.defineMetadata(DazeModuleType.PROVIDES, provideMetaMap, target.constructor);
  };
}

export function ProvideOn() {
  return function (_target: object, _key: string | symbol, _descriptor: TypedPropertyDescriptor<any>) {
    return null;
  };
}

export function ProvideOnConfig(key: string): ClassDecorator | MethodDecorator | any {
  return function (target: Function | object, _key: string | symbol | undefined, descriptor?: TypedPropertyDescriptor<any> | undefined) {
    const provideMetaMap: Map<any, ProvideMetaData> = Reflect.getMetadata(DazeModuleType.PROVIDE_ON_CONFIG, target.constructor) ?? new Map();
    // on method
    if (!!_key) {
      provideMetaMap.set(_key, new ProvideMetaData(key, descriptor?.value, target));
      Reflect.defineMetadata(DazeModuleType.PROVIDE_ON_CONFIG, provideMetaMap, target.constructor);
    } 
    // on class
    else {
      provideMetaMap.set(target, new ProvideMetaData(key, {}));
      Reflect.defineMetadata(DazeModuleType.PROVIDE_ON_CONFIG, provideMetaMap, target);
    }
  };
}

export function ProvideOnMissing(provider: string | Function): MethodDecorator {
  return function (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const provideMetaMap: Map<string | symbol, ProvideMetaData> = Reflect.getMetadata(DazeModuleType.PROVIDE_ON_MISSING, target.constructor) ?? new Map();
    const method = descriptor.value;
    if (typeof method !== 'function') {
      return;
    }
    provideMetaMap.set(key, new ProvideMetaData(key, method, target, provider));
    Reflect.defineMetadata(DazeModuleType.PROVIDE_ON_MISSING, provideMetaMap, target.constructor);
  };
}
