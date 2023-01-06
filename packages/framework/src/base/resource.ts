/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Resource } from '../resource';
import { ComponentType } from '../decorators/component-type';

@ComponentType('resource')
export abstract class BaseResource {

  collection(data: any): Resource {
    return new Resource(this.constructor as any).collection(data);
  }

  item(data: any): Resource {
    return new Resource(this.constructor as any).item(data);
  }

  static collection(data: any): Resource {
    return new Resource(this as any).collection(data);
  }

  static item(data: any): Resource {
    return new Resource(this as any).item(data);
  }
}

