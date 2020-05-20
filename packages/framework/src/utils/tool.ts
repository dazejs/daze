/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

export class Tool {

  /**
   * defer function based on promise
   * 基于 promise 的延迟函数
   */
  static defer<T>() {
    const result: any = {};
    result.promise = new Promise<T>((resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
      result.resolve = resolve;
      result.reject = reject;
    });
    return result;
  }

  static A = A;
  static O = O;
  static pipe = pipe;
}
