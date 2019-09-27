/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function formatPrefix(prefix = '') {
  let prefixed = prefix.slice(0, 1) === '/' ? prefix : `/${prefix}`;
  prefixed = prefixed.slice(-1) === '/' ? prefixed.slice(0, prefixed.length - 1) : prefixed;
  return prefixed;
};
