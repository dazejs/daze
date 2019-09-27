/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base'
import { Item, Collection } from '../resource'
import { ComponentType } from '../symbol'

export class Resource extends Base {
  /**
   * use collection resource
   * @param data resource data
   * @param  formatter resource formatter
   */
  collection(data: any, formatter: any) {
    const resource = new Collection(data, formatter);
    return resource.withoutKey().output();
  }

  /**
   * use item resource
   * @param data resource data
   * @param formatter resource formatter
   */
  item(data: any, formatter: any) {
    const resource = new Item(data, formatter);
    return resource.withoutKey().output();
  }

  /**
   * return item resource and collection resource method
   * @paramformatter resource formatter
   */
  resource(formatter: any) {
    return {
      item(data: any) {
        const resource = new Item(data, formatter);
        return resource.withoutKey().output();
      },
      collection(data: any) {
        const resource = new Collection(data, formatter);
        return resource.withoutKey().output();
      },
    };
  }

  /**
   * default resolve method
   * @param data
   */
  resolve(data: any) {
    return data;
  }
}

Reflect.defineMetadata('type', ComponentType.Resource, Resource.prototype);
