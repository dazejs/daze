/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Base } from './base';
import { ComponentType } from '../symbol';
import { Request } from '../request';
import { Response } from '../response';
import { TNext } from '../middleware';


@Reflect.metadata('type', ComponentType.Middleware)
@Reflect.metadata('injectable', true)
export abstract class Middleware extends Base {
  abstract resolve(request: Request, next: TNext): Response | Promise<Response>
}


