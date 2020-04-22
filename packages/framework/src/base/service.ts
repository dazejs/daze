/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { componentType } from '../decorators/component-type';
import { Injectable } from './injectable';

@componentType('service')
export abstract class BaseService extends Injectable {

}
