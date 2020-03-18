import { ProviderType } from '../symbol';

/**
 * 按优先级组织组件执行的顺序, 比如Middleware的执行顺序
 * 
 * @param value 优先级, 越小优先级越高
 */
export function Order(value: number = Number.MAX_SAFE_INTEGER): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(ProviderType.ORDER, value, target);
  };
}

export function order(value: number = Number.MAX_SAFE_INTEGER): ClassDecorator {
  return Order(value);
}