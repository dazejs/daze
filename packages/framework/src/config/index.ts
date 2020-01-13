/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import { Container } from '../container';
import { IllegalArgumentError } from '../errors/illegal-argument-error';
import { Application } from '../foundation/application';

export class Config {
  /**
   * @var {object} this._app Application
   */
  _app: Application = Container.get('app');

  /**
   * @var {object} this._items configuration
   * */
  _items: object = {};

  /**
   * for proxy
   */
  [key: string]: any;

  constructor() {
    /**
     * proxy
     */
    return new Proxy(this, this.proxy());
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
    };
  }

  /**
   * async initialize
   */
  async initialize() {
    await this.parse();
  }

  /**
   * Parses configuration files to instance properties
   */
  private async parse() {
    if (!fs.existsSync(this._app.configPath)) return;
    const currentEnv = this.env;
    // const files = fs.readdirSync(this._app.configPath);
    const filePaths = glob.sync(path.join(this._app.configPath, '**/*.@(js|ts)'), {
      nodir: true,
      matchBase: true
    });

    for (const file of filePaths) {
      const extname = path.extname(file);
      const normalBasename = path.basename(file, extname);
      const currentConfig = (await import(file)).default;
      if (!~path.basename(file, extname).indexOf('.')) {
        if (!this.has(normalBasename)) {
          this.set(normalBasename, currentConfig);
        } else {
          const oldConfig = this.get(normalBasename);
          if (oldConfig && !Array.isArray(oldConfig) && typeof oldConfig === 'object') {
            this.set(normalBasename, {
              ...oldConfig,
              ...currentConfig
            });
          } else {
            this.set(normalBasename, currentConfig);
          }
        }
      }
    }

    for (const file of filePaths) {
      const extname = path.extname(file);
      const envBasename = path.basename(file, `.${currentEnv}${extname}`);
      const currentConfig = (await import(file)).default;
      if (~file.indexOf(`.${currentEnv}${extname}`)) {
        if (!this.has(envBasename)) {
          this.set(envBasename, currentConfig);
        } else {
          const oldConfig = this.get(envBasename);
          if (oldConfig && !Array.isArray(oldConfig) && typeof oldConfig === 'object') {
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
  setValue(names: any[], value: any, index = 0) {
    const res: any = {};
    const name = names[index];
    const {
      length,
    } = names;
    if (length > index + 1) {
      res[name] = this.setValue(names, value, index + 1);
    } else {
      res[name] = value;
    }
    return res;
  }

  /**
   * Set the property value according to the property name
   */
  set(name: string, value: any) {
    if (typeof name !== 'string') throw new IllegalArgumentError('Config#set name must be String!');
    const names = name.split('.');
    const nameValue = this.setValue(names, value);
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
    let value: any = this._items;
    // Gets all the configuration when name is empty
    if (!name) {
      return value;
    }
    const names = String(name).split('.');
    for (const n of names) {
      if (typeof value === 'object' && !Reflect.has(value, n)) {
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
    return this._app.getEnv();
  }
}