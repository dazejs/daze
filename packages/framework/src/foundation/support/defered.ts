/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export class Deferred<T> {
  /**
   * promise
   */
  private _promise: Promise<T>


  /**
   * resolve func
   */
  private _resolve: (value?: T | PromiseLike<T>) => void

  /**
   * reject func
   */
  private _reject: (reason?: any) => void

  /**
   * Create Deferred
   */
  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  /**
   * promise getter
   */
  get promise(): Promise<T> {
    return this._promise
  }

  /**
   * resolve promise
   * @param value 
   */
  resolve (value?: T | PromiseLike<T>): void {
    this._resolve(value)
  }

  /**
   * reject promise
   * @param reason 
   */
  reject (reason?: any): void {
    this._reject(reason)
  }
}