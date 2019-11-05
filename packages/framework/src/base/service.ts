/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base';
import { ComponentType } from '../symbol';


@Reflect.metadata('type', ComponentType.Service)
@Reflect.metadata('injectable', true)
export abstract class Service extends Base {

}
