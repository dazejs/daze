/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Container } from '../container'
import { Response } from '../response'
import { Redirect } from '../response/redirect'

export interface IBase {
  [key: string]: any
}
export interface IBaseConstructor {
  new(...args: any[]): IBase;
}

export class Base implements IBase {
  /**
   * Application instance getter
   */
  get app() {
    return Container.get('app');
  }

  /**
   * Config instance getter
   */
  get config() {
    return Container.get('config');
  }

  /**
   * Message instance getter
   */
  get messenger() {
    return Container.get('messenger');
  }

  /**
   * create response instance
   * @param params response constructor params
   */
  response(...params: any[]) {
    return new Response(...params);
  }

  /**
   * create redirect instance
   * @param params redirect constructor params
   */
  redirect(...params: any[]) {
    return new Redirect(...params);
  }
}
