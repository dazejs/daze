/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Injectable } from './injectable';
import { ComponentType } from '../symbol';
import { Request } from '../request';
import { Response } from '../response';
import { TNext } from '../middleware';


@Reflect.metadata('type', ComponentType.Middleware)
export abstract class Middleware extends Injectable {
  abstract resolve(request: Request, next: TNext): Response | Promise<Response>
}


