/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Response } from '../response';
import { ComponentType } from '../symbol';
import { Base } from './base';

import { Request } from '../request';
import { TNext } from '../middleware';


@Reflect.metadata('type', ComponentType.Middleware)
export abstract class Middleware extends Base {
  abstract resolve(request: Request, next: TNext): Response | Promise<Response>
  // abstract resolve(...args: any[]): Response | Promise<Response>
}


