/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Injectable } from './injectable';
import { ComponentType } from '../symbol';


@Reflect.metadata('type', ComponentType.Service)
export abstract class Service extends Injectable {

}
