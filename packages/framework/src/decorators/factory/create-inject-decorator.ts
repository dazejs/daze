/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { patchClass, patchProperty, patchMethod } from './patch-decorator'

function handle(args: any[], params: any, type: string) {
  if (args.length === 1) {
    const [target] = args
    const decorator = patchClass(type, params);
    return decorator(target)
  }
  if (args.length == 3) {
    const [target, propertyKey, descriptor] = args
    if (descriptor) {
      const decorator = patchMethod(type, params);
      return decorator(target, propertyKey, descriptor)
    } else {
      const [target, propertyKey] = args
      const decorator = patchProperty(type, params);
      return decorator(target, propertyKey)
    }
  }
}

export function createInjectDecorator(type: string){
  return (...args: any[]) => (...argsClass: any[])  => handle(argsClass, args, type);
};
