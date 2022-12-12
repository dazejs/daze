import { ProviderType } from '../symbol';

/**
 * Organize the order in which components are executed by priority, such as the order in which Middleware is executed
 * 
 * @param value Priority, the smaller the higher the priority
 */
export const Order = function (value: number = Number.MAX_SAFE_INTEGER): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(ProviderType.ORDER, value, target);
  };
};

export const Priority = Order;