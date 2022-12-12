/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HTTP_CODE } from '../symbol';

export const HttpCode = function (code = 200): MethodDecorator {
  return function (target: Record<string, any>, propertyKey: string | symbol) {
    target[propertyKey.toString()][HTTP_CODE] = code;
  };
};
