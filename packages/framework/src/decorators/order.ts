import { ProviderType } from '../symbol';

export function Order(value: number = Number.MAX_SAFE_INTEGER): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(ProviderType.ORDER, value, target);
  };
}

export function order(value: number = Number.MAX_SAFE_INTEGER): ClassDecorator {
  return Order(value);
}