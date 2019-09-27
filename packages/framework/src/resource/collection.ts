/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Resource, EResourceTypeList } from './resource'

export class Collection extends Resource {
  constructor(data: any, formatter: string | ((...args: any[]) => any), key: string = '') {
    super(data, formatter, key);
    this.type = EResourceTypeList.Collection;
  }
}