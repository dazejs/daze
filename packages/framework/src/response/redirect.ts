/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Response } from './'
import * as symbols from '../symbol'
import { Validate } from '../validate'

export class Redirect extends Response {
  /**
   * @var needWithInput
   */
  needWithInput: boolean = false;

  /**
   *  @var errors in session
   */
  errors: any;

  /**
   *  @var sessions in session
   */
  flashSessions: any = null;

  /**
   * @var alt
   */
  alt: any = null;

  /**
   * force redirect back
   */
  forceBack = false;

  constructor(url: string = '', code = 302, header = {}) {
    super(url, code, header);
    this.cacheControl('no-cache,must-revalidate');
  }

  /**
   * 设置重定向地址
   * @param url
   */
  setUrl(url: string) {
    this.setData(url);
    return this;
  }

  /**
   * alias setUrl
   */
  go(url: string, code = 302) {
    this.setUrl(url).setCode(code);
    return this;
  }

  /**
   * 获取跳转地址
   */
  getUrl() {
    const data = this.getData();
    return data;
  }

  /**
   * 设置重定向地址
   * @param alt
   * @param code
   */
  back(alt?: string, code = 302) {
    this.alt = alt;
    this.forceBack = true;
    this.setCode(code);
    return this;
  }

  /**
   * withInput
   */
  withInput() {
    this.needWithInput = true;
  }

  /**
   * 保存一次性 session
   * @param name
   * @param value
   */
  with(name: any, value: any) {
    if (!name || !value) return this;
    if (!this.flashSessions) this.flashSessions = {};
    if (typeof name === 'object') {
      Object.keys(name).forEach((key) => {
        this.flashSessions[key] = name[key];
      });
    } else {
      this.flashSessions[name] = value;
    }
    return this;
  }

  /**
   * withErrors
   * @param  val errors
   */
  withErrors(val: any) {
    if (!val) return this;
    this.errors = val;
    return this;
  }

  async send(request: any) {
    if (this.forceBack) {
      const url = request.session().get(symbols.SESSION.PREVIOUS) || request.getHeader('Referrer') || this.alt || '/';
      this.setUrl(url);
    }

    if (this.flashSessions) {
      const flashKeys = Object.keys(this.flashSessions);
      for (const key of flashKeys) {
        request.session().flash(key, this.flashSessions[key]);
      }
    }

    if (this.errors) {
      if (this.errors instanceof Validate) {
        request.session().flash(symbols.SESSION.ERRORS, this.errors.message.format());
      } else {
        request.session().flash(symbols.SESSION.ERRORS, this.errors);
      }
    }
    this.setHeader('Location', this.getUrl());
    super.send(request);
  }
}
