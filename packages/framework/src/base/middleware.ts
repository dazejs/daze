/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { TNext } from '../middleware';
import type { Request } from '../request';
import { Base } from './base';
import { componentType } from '../decorators/component-type';

@componentType('middleware')
export abstract class BaseMiddleware extends Base {
  abstract resolve(request: Request, next: TNext): any | Promise<any>
}


