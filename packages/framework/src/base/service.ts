/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ComponentType } from '../symbol';
import { Injectable } from './injectable';

@Reflect.metadata('type', ComponentType.Service)
export abstract class Service extends Injectable {

}
