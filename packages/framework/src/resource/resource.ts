/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Container } from '../container'
import { Application } from '../foundation/application'

const DEFAULT_KEY = 'data';

export enum EResourceTypeList {
  Item = 'item',
  Collection = 'collection'
}

export class Resource {
  /**
   * @var app Application instance
   */
  protected app: Application = Container.get('app');

  /**
   * @var key resource data key
   */
  public key?: string = DEFAULT_KEY;

  /**
   * @var data resource data
   */
  public data: any;

  /**
   * @var formatter resource data formatter
   */
  public formatter: string | ((...args: any[]) => any);

  /**
   * @var formatter resource meta data formatter
   */
  public metaFormatter: any;

  /**
   * @var meta resource meta data
   */
  public meta: any;

  /**
   * resource type
   */
  public type: EResourceTypeList;

  /**
   * Create Resource
   */
  constructor(data?: any, formatter: any = null, key: any = null) {
    this.data = data;
    if (key) this.key = key;
    if (formatter) this.formatter = formatter;
  }

  /**
   * set resource data formatter
   * @param formatter resource data formatter
   */
  public setFormatter(formatter: any) {
    this.formatter = formatter;
    return this;
  }

  /**
   * get resource data formatter
   */
  public getFormatter() {
    return this.formatter;
  }

  /**
   * Resource Key getter
   * @var {string} resource key
   */
  public getKey() {
    return this.key;
  }

  /**
   * Resource Key Setter
   * @var resource key
   */
  public setKey(val: string) {
    this.key = val;
    return this;
  }

  /**
   * Resource data getter
   */
  public getData() {
    return this.data;
  }

  /**
   * Resource data Setter
   */
  public setData(val: any) {
    this.data = val;
    return this;
  }

  /**
   * Resource meta getter
   */
  public getMeta() {
    return this.meta;
  }

  /**
   * Resource meta Setter
   * @var resource meta
   */
  public setMeta(val: any) {
    this.meta = val;
    return this;
  }

  /**
   * meta formatter formatter getter
   */
  public getMetaFormatter() {
    return this.metaFormatter;
  }

  /**
   * meta formatter formatter setter
   * @var meta formatter
   */
  public setMetaFormatter(val: any) {
    this.metaFormatter = val;
    return this;
  }

  /**
   * add meta object
   * @param name meta object key name
   * @param value meta value for name key
   */
  public addMeta(name: string | object, value?: any) {
    if (!this.meta) this.meta = {};
    if (name && typeof name === 'object') {
      this.meta = Object.assign({}, this.meta, name);
    } else if (typeof name === 'string') {
      this.meta[name] = value;
    }
    return this;
  }

  /**
   * remove reource key
   */
  public withoutKey() {
    this.key = undefined;
    return this;
  }

  /**
   * transform resource meta object
   */
  protected transformResourceMeta() {
    return this.useTransformer(this.metaFormatter, this.meta);
  }

  /**
   * transform resource data object or array
   */
  protected transformResourceData() {
    if (this.type === EResourceTypeList.Item) {
      return this.useTransformer(this.formatter, this.data);
    }
    if (this.type === EResourceTypeList.Collection) {
      return this.data.map((i: any) => this.useTransformer(this.formatter, i));
    }
    return this.data;
  }

  /**
   * use tansformer transform data or meta
   * @param formatter resource formatter
   * @param data resource meta or data
   */
  protected useTransformer(formatter: any, data: any) {
    if (!data) return null;
    // 如果是字符串
    if (typeof formatter === 'string') {
      const Transformer = this.app.get(`resource.${formatter}`);
      return Transformer.resolve(data);
    }
    // 如果是回调函数
    if (typeof formatter === 'function') {
      return formatter(data);
    }
    return data;
  }

  /**
    * serialize Rource data
    * @param isWrapCollection is collection use wrap key
    */
  protected serializeResourceData(isWrapCollection = true) {
    const data = this.transformResourceData();
    if (this.type === EResourceTypeList.Collection) {
      if (this.key) {
        return {
          [this.key]: data,
        };
      }
      return isWrapCollection ? {
        data,
      } : data;
    }
    if (this.type === EResourceTypeList.Item) {
      if (this.key) {
        return {
          [this.key]: data,
        };
      }
      return data;
    }
    if (this.key) {
      return {
        [this.key]: null,
      };
    }
    return null;
  }

  /**
    * serialize resource meta
    */
  protected serializeResourceMeta() {
    const meta = this.transformResourceMeta();
    return meta ? {
      meta,
    } : null;
  }

  /**
   * transform data
   */
  public transform() {
    const data = this.serializeResourceData();
    const meta = this.serializeResourceMeta();

    if (meta) {
      return { data, meta };
    }
    return data;
  }

  /**
   * output result
   */
  public output() {
    return this.transform();
  }
}
