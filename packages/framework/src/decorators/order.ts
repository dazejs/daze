import { ProviderType } from '../symbol';

/**
 * Organize the order in which components are executed by priority, such as the order in which Middleware is executed
 * 
 * @param value Priority, the smaller the higher the priority
 */
export const order = function (value: number = Number.MAX_SAFE_INTEGER): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(ProviderType.ORDER, value, target);
  };
};

export const Order = order;
export const priority = order;
export const Priority = order;