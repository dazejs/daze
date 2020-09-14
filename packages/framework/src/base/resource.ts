/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Resource } from '../resource';
import { componentType } from '../decorators/component-type';
import { Injectable } from './injectable';
import { Paginator } from '../pagination';

@componentType('resource')
export abstract class BaseResource extends Injectable {

  collection(data: any): Resource {
    return new Resource(this.constructor as any).collection(data);
  }

  item(data: any): Resource {
    return new Resource(this.constructor as any).item(data);
  }

  pagination(paginator: Paginator) {
    return new Resource(this.constructor as any).pagination(paginator);
  }

  static collection(data: any): Resource {
    return new Resource(this as any).collection(data);
  }

  static item(data: any): Resource {
    return new Resource(this as any).item(data);
  }

  static pagination(paginator: Paginator): Resource {
    return new Resource(this as any).pagination(paginator);
  }
}

