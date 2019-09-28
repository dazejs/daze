/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * defer function based on promise
 * 基于 promise 的延迟函数
 */

export function defer<T>() {
  const result: any = {};
  result.promise = new Promise<T>((resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};
