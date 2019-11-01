/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { MULTITON } from '../symbol';


function createMultitonClass(target: any) {
  target[MULTITON] = true;
  return target;
}

function handle(args: any[]) {
  if (args.length === 1) {
    const [target] = args;
    return createMultitonClass(target);
  }
  throw new Error('@Multiton must be decorate on Class');
}

export function Multiton() {
  return (...args: any[]) => handle(args);
};
