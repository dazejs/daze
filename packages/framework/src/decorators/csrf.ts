/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { UseMiddleware } from './use/use-middleware';
import { VerifyCsrfToken } from '../foundation/buildin-app/middlewares/verify-csrf-token';

export const CSRF = function () {
  return UseMiddleware(VerifyCsrfToken);
};
export const Csrf = CSRF;
