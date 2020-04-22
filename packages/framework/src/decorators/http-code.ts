/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HTTP_CODE } from '../symbol';


function injectedMethod(target: any, name: string, descriptor: any, code: number) {
  target[name][HTTP_CODE] = code;
  return descriptor;
}

function handle(args: any[], code: number) {
  if (args.length > 1) {
    const [target, name, descriptor] = args;
    return injectedMethod(target, name, descriptor, code);
  }
  throw new Error('@HttpCode must be decorate on method');
}

export function httpCode(code = 200) {
  return (...args: any[]) => handle(args, code);
};
