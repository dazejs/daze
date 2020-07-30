/**
 * Copyright (c) 2018 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EResourceTypeList, FormatterType, Resource } from './resource';


export class ResourceCollection<TFormater = any> extends Resource<TFormater> {
  constructor(formatter?: FormatterType<TFormater>) {
    super(formatter);
    this.type = EResourceTypeList.Collection;
  }
}