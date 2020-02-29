/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { TNext } from '../middleware';
import type { Request } from '../request';
import { ComponentType } from '../symbol';
import { Base } from './base';

@Reflect.metadata('type', ComponentType.Middleware)
export abstract class Middleware extends Base {
  abstract resolve(request: Request, next: TNext): any | Promise<any>
}


