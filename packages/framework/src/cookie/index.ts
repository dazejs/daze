/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */
import { Container } from '../container';
import { Application } from '../foundation/application';

export interface CookieOptions {
  maxAge?: number;
  expires?: number;
  path?: string;
  signed?: boolean;
  domain?: string;
  httpOnly?: boolean;
  overwrite?: boolean;
  secure?: boolean;
}

export class Cookie {
  /**
   * app instance
   */
  app: Application = Container.get('app');

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
  options: CookieOptions;
  /**
   * Create Cookie instance
   */
  constructor(name: string, value: string, options: CookieOptions = {}) {
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
  getOptions(): CookieOptions {
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
  setMaxAge(expiry = 0): this {
    this.options.maxAge = expiry;
    return this;
  }

  /**
   * set cookie options - domain
   */
  setDomain(pattern = ''): this {
    this.options.domain = pattern;
    return this;
  }

  /**
   * set cookie options - path
   */
  setPath(uri = '/'): this {
    this.options.path = uri;
    return this;
  }

  /**
   * set cookie options - secure
   */
  setSecure(flag = false): this {
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
