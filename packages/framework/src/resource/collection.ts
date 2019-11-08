/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EResourceTypeList, FormatterType, Resource } from './resource';


export class Collection extends Resource {
  constructor(data: any, formatter?: FormatterType, key?: string) {
    super(data, formatter, key);
    this.type = EResourceTypeList.Collection;
  }
}