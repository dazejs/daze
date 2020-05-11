/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Collection, Item } from '../resource';
import { componentType } from '../decorators/component-type';
import { Injectable } from './injectable';

@componentType('resource')
export abstract class BaseResource extends Injectable {
  /**
   * use collection resource
   * @param data resource data
   * @param  formatter resource formatter
   */
  collection(data: any, formatter: any): Collection {
    const resource = new Collection(data, formatter);
    return resource.withoutKey().output(false);
  }

  /**
   * use item resource
   * @param data resource data
   * @param formatter resource formatter
   */
  item(data: any, formatter: any): Item {
    const resource = new Item(data, formatter);
    return resource.withoutKey().output(false);
  }

  /**
   * return item resource and collection resource method
   * @paramformatter resource formatter
   */
  resource(formatter: any) {
    return {
      item(data: any): Item {
        const resource = new Item(data, formatter);
        return resource.withoutKey().output(false);
      },
      collection(data: any): Collection {
        const resource = new Collection(data, formatter);
        return resource.withoutKey().output(false);
      },
    };
  }
}

