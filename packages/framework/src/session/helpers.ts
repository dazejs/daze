/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { crc32 } from 'crc'

export function decode(str: string) {
  const body = Buffer.from(str, 'base64').toString('utf8');
  const json = JSON.parse(body);
  return json;
};

export function encode(body: any) {
  return Buffer.from(JSON.stringify(body)).toString('base64');
};

export function hash(sess: any) {
  return crc32(JSON.stringify(sess));
};
