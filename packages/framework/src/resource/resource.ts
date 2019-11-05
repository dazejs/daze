/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Container } from '../container';
import { Application } from '../foundation/application';
import { Resource as BaseResource } from '../base/resource';
import { ComponentType } from '../symbol';

const DEFAULT_KEY = 'data';

export const enum EResourceTypeList {
  Item = 'item',
  Collection = 'collection'
}

export type FormatterType = string | { new(): BaseResource } | ((...args: any[]) => any)

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
  public formatter: FormatterType;

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
  constructor(data?: any, formatter?: FormatterType, key?: any) {
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
  protected useTransformer(formatter: FormatterType, data: any) {
    if (!data) return null;
    // 如果是字符串
    if (typeof formatter === 'string') {
      return this.useStringFormatter(formatter, data);
    }
    // 如果是资源类
    if (this.isResourceFormatter(formatter)) {
      return this.useResourceFormatter(formatter, data);
    }
    // 如果是回调函数/类
    if (typeof formatter === 'function') {
      // 容器中已绑定
      return this.useCallbackFormatter(formatter, data);
    }
    return data;
  }

  /**
   * check if is resource component
   * @param formatter 
   */
  protected isResourceFormatter(formatter: { new(): BaseResource } | ((...args: any[]) => any)): formatter is { new(): BaseResource }  {
    return Reflect.getMetadata('type', formatter) === ComponentType.Resource;
  }

  /**
   * use string type formatter
   * @param formatter 
   * @param data 
   */
  protected useStringFormatter(formatter: string, data: any) {
    const Transformer = this.app.get(`resource.${formatter}`);
    return Transformer.resolve(data);
  }

  /**
   * use resource type formatter
   * @param formatter 
   * @param data 
   */
  protected useResourceFormatter(formatter: { new(): BaseResource }, data: any) {
    const Transformer = this.app.get(formatter);
    return Transformer.resolve(data);
  }

  /**
   * use function formatter
   * @param formatter 
   * @param data 
   */
  protected useCallbackFormatter(formatter: (...args: any[]) => any, data: any) {
    return formatter(data);
  }

  /**
    * serialize Rource data
    * @param isWrapCollection is collection use wrap key
    */
  protected serializeResourceData(isOverstore = true) {
    const data = this.transformResourceData();
    if (this.type === EResourceTypeList.Collection) {
      if (this.key) {
        return {
          [this.key]: data,
        };
      }
      return isOverstore ? {
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
  public transform(isOverstore = true) {
    const data = this.serializeResourceData(isOverstore);
    const meta = this.serializeResourceMeta();
    if (meta) {
      return { data, meta };
    }
    return data;
  }

  /**
   * output result
   */
  public output(isOverstore = true) {
    return this.transform(isOverstore);
  }
}
