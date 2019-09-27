/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import fs from 'fs'
import path from 'path'
import is from 'core-util-is'
import { Container } from '../container'
import { IllegalArgumentError } from '../errors/illegal-argument-error'

const SET_VALUE = Symbol('Config#setValue');
const PARSE = Symbol('Config#parse');

const envMap = new Map([
  ['development', 'dev'],
  ['test', 'test'],
  ['production', 'prod'],
]);

export class Config {
  _app: any;
  _items: any;
  [key: string]: any;
  constructor() {
    /**
     * @var {object} this._app Application
     */
    this._app = Container.get('app');
    /**
     * @var {object} this._items configuration
     * */
    this._items = {};

    /**
     * proxy
     */
    return new Proxy(this, this.proxy())
  }

  /**
   * get proxy handler
   */
  private proxy(): ProxyHandler<this> {
    return {
      get(t, prop, receiver) {
        if (Reflect.has(t, prop) || typeof prop === 'symbol') {
          return Reflect.get(t, prop, receiver);
        }
        return t.get(prop);
      }
    }
  }

  /**
   * async initialize
   */
  async initialize() {
    await this[PARSE]();
  }

  /**
   * Parses configuration files to instance properties
   */
  async [PARSE]() {
    const currentEnv = this.env;
    const files = fs.readdirSync(this._app.configPath);
    for (const file of files) {
      const extname = path.extname(file)
      const normalBasename = path.basename(file, extname);
      const envBasename = path.basename(file, `.${currentEnv}${extname}`);
      const currentConfig = (await import(path.join(this._app.configPath, file))).default;
      if (!~path.basename(file, extname).indexOf('.')) {
        if (!this.has(normalBasename)) {
          this.set(normalBasename, currentConfig);
        } else {
          const oldConfig = this.get(normalBasename);
          if (is.isObject(oldConfig)) {
            this.set(normalBasename, {
              ...oldConfig,
              ...currentConfig
            });
          } else {
            this.set(normalBasename, currentConfig);
          }
        }
      }
      if (~file.indexOf(`.${currentEnv}${extname}`)) {
        if (!this.has(envBasename)) {
          this.set(envBasename, currentConfig);
        } else {
          const oldConfig = this.get(envBasename);
          if (is.isObject(oldConfig)) {
            this.set(envBasename, {
              ...oldConfig,
              ...currentConfig
            });
          } else {
            this.set(envBasename, currentConfig);
          }
        }
      }
    }
    
    return this._items;
  }

  /**
   * Sets the property value recursively based on the property name
   */
  [SET_VALUE](names: any[], value: any, index = 0) {
    const res: any = {};
    const name = names[index];
    const {
      length,
    } = names;
    if (length > index + 1) {
      res[name] = this[SET_VALUE](names, value, index + 1);
    } else {
      res[name] = value;
    }
    return res;
  }

  /**
   * Set the property value according to the property name
   */
  set(name: string, value: any) {
    if (!is.isString(name)) throw new IllegalArgumentError('Config#set name must be String!');
    const names = name.split('.');
    const nameValue = this[SET_VALUE](names, value);
    // Merge configuration attributes
    this._items = {
      ...this._items,
      ...nameValue
    };
    return this._items;
  }

  /**
   * The name of the configuration
   */
  get(name?: string | number, def?: any) {
    let value = this._items;
    // Gets all the configuration when name is empty
    if (!name) {
      return value;
    }
    const names = String(name).split('.');
    for (const n of names) {
      if (!Reflect.has(value, n)) {
        value = undefined;
        break;
      }
      value = value[n];
    }
    return value === undefined ? def : value;
  }

  /**
   * Determine whether the configuration exists
   */
  has(name = '') {
    if (!name) {
      return false;
    }
    return !(this.get(name) === undefined);
  }

  /**
   * current env getter
   */
  get env() {
    return process.env.DAZE_ENV || (process.env.NODE_ENV && envMap.get(process.env.NODE_ENV)) || process.env.NODE_ENV;
  }
}