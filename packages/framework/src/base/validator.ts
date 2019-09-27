/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base'
import { ComponentType } from '../symbol'

export class Validator extends Base {

}

Reflect.defineMetadata('type', ComponentType.Validator, Validator.prototype);
