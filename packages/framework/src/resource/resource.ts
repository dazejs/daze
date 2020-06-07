/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { BaseResource } from '../base/resource';
import { Container } from '../container';
import { Application } from '../foundation/application';
import { ResourceInterface } from '../interfaces';

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
  app: Application = Container.get('app');

  /**
   * @var key resource data key
   */
  key?: string = DEFAULT_KEY;

  /**
   * @var data resource data
   */
  data: any;

  /**
   * @var formatter resource data formatter
   */
  formatter: FormatterType;

  /**
   * @var formatter resource meta data formatter
   */
  metaFormatter: any;

  /**
   * @var meta resource meta data
   */
  meta: any;

  /**
   * resource type
   */
  type: EResourceTypeList;

  /**
   * controller context in container
   */
  __context__: any[] = []

  /**
   * Create Resource
   */
  constructor(data?: any, formatter?: FormatterType, key?: any) {
    this.data = data;
    if (key) this.key = key;
    if (formatter) this.formatter = formatter;
  }

  /**
   * set inject context
   * @param context 
   */
  setContext(context: any[]) {
    this.__context__ = context;
    return this;
  }


  /**
   * set resource data formatter
   * @param formatter resource data formatter
   */
  setFormatter(formatter: any) {
    this.formatter = formatter;
    return this;
  }

  /**
   * get resource data formatter
   */
  getFormatter() {
    return this.formatter;
  }

  /**
   * Resource Key getter
   * @var {string} resource key
   */
  getKey() {
    return this.key;
  }

  /**
   * Resource Key Setter
   * @var resource key
   */
  setKey(val: string) {
    this.key = val;
    return this;
  }

  /**
   * Resource data getter
   */
  getData() {
    return this.data;
  }

  /**
   * Resource data Setter
   */
  setData(val: any) {
    this.data = val;
    return this;
  }

  /**
   * Resource meta getter
   */
  getMeta() {
    return this.meta;
  }

  /**
   * Resource meta Setter
   * @var resource meta
   */
  setMeta(val: any) {
    this.meta = val;
    return this;
  }

  /**
   * meta formatter formatter getter
   */
  getMetaFormatter() {
    return this.metaFormatter;
  }

  /**
   * meta formatter formatter setter
   * @var meta formatter
   */
  setMetaFormatter(val: any) {
    this.metaFormatter = val;
    return this;
  }

  /**
   * add meta object
   * @param name meta object key name
   * @param value meta value for name key
   */
  addMeta(name: string | object, value?: any) {
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
  withoutKey() {
    this.key = undefined;
    return this;
  }

  /**
   * transform resource meta object
   */
  transformResourceMeta() {
    return this.useTransformer(this.metaFormatter, this.meta);
  }

  /**
   * transform resource data object or array
   */
  transformResourceData() {
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
  useTransformer(formatter: FormatterType, data: any) {
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
  isResourceFormatter(formatter: { new(): BaseResource } | ((...args: any[]) => any)): formatter is { new(): BaseResource }  {
    return formatter && Reflect.getMetadata('type', formatter) === 'resource';
  }

  /**
   * use string type formatter
   * @param formatter 
   * @param data 
   */
  useStringFormatter(formatterName: string, data: any) {
    // AMRK: COMPONENT_NAME
    // const Transformer = this.app.get(`resource.${formatter}`, this.__context__);
    const Transformer = this.app.get<ResourceInterface>(formatterName, this.__context__);
    return Transformer.resolve(data);
  }

  /**
   * use resource type formatter
   * @param formatter 
   * @param data 
   */
  useResourceFormatter(formatter: { new(): BaseResource }, data: any) {
    const Transformer = this.app.get<ResourceInterface>(formatter, this.__context__);
    return Transformer.resolve(data);
  }

  /**
   * use function formatter
   * @param formatter 
   * @param data 
   */
  useCallbackFormatter(formatter: (...args: any[]) => any, data: any) {
    return formatter(data);
  }

  /**
    * serialize Rource data
    * @param isWrapCollection is collection use wrap key
    */
  serializeResourceData(isOverstore = true) {
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
  serializeResourceMeta() {
    const meta = this.transformResourceMeta();
    return meta ? {
      meta,
    } : null;
  }

  /**
   * transform data
   */
  transform(isOverstore = true) {
    const data = this.serializeResourceData(isOverstore) || {};
    const meta = this.serializeResourceMeta() || {};
    if (meta) {
      return { ...data, ...meta };
    }
    return data;
  }

  /**
   * output result
   */
  output(isOverstore = true) {
    return this.transform(isOverstore);
  }
}
