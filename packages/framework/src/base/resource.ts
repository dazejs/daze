/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ResourceItem, ResourceCollection } from '../resource';
import { componentType } from '../decorators/component-type';
import { Injectable } from './injectable';

@componentType('resource')
export abstract class BaseResource extends Injectable {

  collection(data: any): ResourceCollection {
    return new ResourceCollection(this.constructor as any).setData(data);
  }

  item(data: any): ResourceItem {
    return new ResourceItem(this.constructor as any).setData(data);
  }

  static collection(data: any): ResourceCollection {
    return new ResourceCollection(this as any).setData(data);
  }

  static item(data: any): ResourceItem {
    return new ResourceItem(this as any).setData(data);
  }
}

