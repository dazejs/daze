/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EResourceTypeList, FormatterType, Resource } from './resource';


export class ResourceItem<TFormatter = any> extends Resource<TFormatter> {
  constructor(formatter?: FormatterType<TFormatter>) {
    super(formatter);
    this.type = EResourceTypeList.Item;
  }
}

