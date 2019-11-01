/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function decorateClass(target: any) {
  Reflect.defineMetadata('ignore', true, target);
  return target;
}

function handle(args: any[]) {
  if (args.length === 1) {
    const [target] = args;
    return decorateClass(target);
  }
  throw new Error('@Ignore must be decorate on Class');
}

export function Ignore() {
  return (...args: any[]) => handle(args);
};
