/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useMiddleware } from './use-middleware';

export function Csrf() {
  return (...args: any) => useMiddleware('verify-csrf-token')(...args);
};

export function csrf() {
  return Csrf();
}
