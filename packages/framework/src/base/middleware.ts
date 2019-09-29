/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base'
import { ComponentType } from '../symbol'
import { Request } from '../request'
import { Response } from '../response'
import { TNext } from '../middleware'


export abstract class Middleware extends Base {
  abstract resolve(request: Request, next: TNext): Response | Promise<Response>
}

Reflect.defineMetadata('type', ComponentType.Middleware, Middleware.prototype);

