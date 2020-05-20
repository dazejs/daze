/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { useMiddleware } from './use-middleware';
import { VerifyCsrfToken } from '../foundation/middlewares/verify-csrf-token';

export const csrf = function () {
  return useMiddleware(VerifyCsrfToken);
};
export const Csrf = csrf;
export const CSRF = csrf;
