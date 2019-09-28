/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base'
import { Item, Collection } from '../resource'
import { ComponentType } from '../symbol'

export abstract class Resource extends Base {
  /**
   * use collection resource
   * @param data resource data
   * @param  formatter resource formatter
   */
  collection(data: any, formatter: any): Collection {
    const resource = new Collection(data, formatter);
    return resource.withoutKey().output();
  }

  /**
   * use item resource
   * @param data resource data
   * @param formatter resource formatter
   */
  item(data: any, formatter: any): Item {
    const resource = new Item(data, formatter);
    return resource.withoutKey().output();
  }

  /**
   * return item resource and collection resource method
   * @paramformatter resource formatter
   */
  resource(formatter: any) {
    return {
      item(data: any): Item {
        const resource = new Item(data, formatter);
        return resource.withoutKey().output();
      },
      collection(data: any): Collection {
        const resource = new Collection(data, formatter);
        return resource.withoutKey().output();
      },
    };
  }

  /**
   * default resolve method
   * @param data
   */
  abstract resolve(data: object): object
}

Reflect.defineMetadata('type', ComponentType.Resource, Resource.prototype);
