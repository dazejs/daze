/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useMiddleware } from './use-middleware';
import { VerifyCsrfToken } from '../foundation/middlewares/verify-csrf-token';

export function Csrf() {
  return (...args: any) => useMiddleware(VerifyCsrfToken)(...args);
};

export function csrf() {
  return Csrf();
}
