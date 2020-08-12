/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EResourceTypeList, Resource } from './resource';


export class ResourceItem extends Resource {
  constructor(formatter?: any) {
    super(formatter);
    this.type = EResourceTypeList.Item;
  }
}

