/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import assert from 'assert'
import { Container } from '../container'
import { IllegalArgumentError} from '../errors/illegal-argument-error'
import { Application } from '../foundation/application'

export interface ICookieOptions {
  maxAge?: number,
  expires?: number,
  path?: string,
  signed?: boolean,
  domain?: string,
  httpOnly?: boolean,
  overwrite?: boolean,
  secure?: boolean,
}

export class Cookie {
  /**
   * app instance
   */
  app: Application;

  /**
   * cookie name
   */
  name: string;

  /**
   * cookie value
   */
  value: string;

  /**
   * cookie options
   */
  options: ICookieOptions;
  /**
   * Create Cookie instance
   */
  constructor(name: string, value: string, options: ICookieOptions = {}) {
    assert(!(/\s|,|;/).test(name), new IllegalArgumentError('Cookie name is not valid!'));
    /**
     * @var app Application
     */
    this.app = Container.get('app');
    /**
     * @var name cookie name
     */
    this.name = name;

    /**
     * @var value cookie value
     */
    this.value = value;

    /**
     * @var options cookie options
     */
    this.options = Object.assign({}, this.app.get('config').get('cookie', {}), options);
  }

  /**
   * get current cookie options
   */
  getOptions(): ICookieOptions {
    return this.options;
  }

  /**
   * get cookie name
   */
  getName(): string {
    return this.name;
  }

  /**
   * get cookie value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * set cookie value
   */
  setValue(val: string): this {
    if (val) {
      this.value = val;
    }
    return this;
  }

  /**
   * set cookie options - httpOnly
   */
  setHttpOnly(flag = true): this {
    this.options.httpOnly = flag;
    return this;
  }

  /**
   * set cookie options - signed
   */
  setSigned(flag = true): this {
    this.options.signed = flag;
    return this;
  }

  /**
   * set cookie should signed
   */
  shouldSigned(): this {
    this.setSigned(true);
    return this;
  }

  /**
   * set cookie dont't signed
   */
  doNotSigned(): this {
    this.setSigned(false);
    return this;
  }

  /**
   * set cookie options - maxAge
   */
  setMaxAge(expiry: number = 0): this {
    this.options.maxAge = expiry;
    return this;
  }

  /**
   * set cookie options - domain
   */
  setDomain(pattern: string = ''): this {
    this.options.domain = pattern;
    return this;
  }

  /**
   * set cookie options - path
   */
  setPath(uri: string = '/'): this {
    this.options.path = uri;
    return this;
  }

  /**
   * set cookie options - secure
   */
  setSecure(flag: boolean = false): this {
    this.options.secure = flag;
    return this;
  }

  /**
   * set cookie options - expires
   */
  setExpires(expires: number): this {
    this.options.expires = expires;
    return this;
  }
}
