/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { Request } from '../http/request';
import { Next } from '../http/middleware';

export interface MiddlewareInterface {
  resolve(request: Request, next: Next): any;
}