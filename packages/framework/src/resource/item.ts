/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Resource, EResourceTypeList, FormatterType } from './resource';

export class Item extends Resource {
  constructor(data: any, formatter?: FormatterType, key?: any) {
    super(data, formatter, key);
    this.type = EResourceTypeList.Item;
  }
}

