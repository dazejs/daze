/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { Response } from '../response';
import { Request } from '../request';
import { Next } from '../middleware';

export interface MiddlewareInterface {
  resolve(request: Request, next: Next): Promise<Response>;
}