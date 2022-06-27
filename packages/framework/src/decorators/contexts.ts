/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { decoratorFactory } from './factory/decorator-factory';

export const conf = (key?: string, defaultValue?: any) =>
  decoratorFactory('config', [key], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key, defaultValue);
    }
  });
export const Conf = conf;

export const messenger = () => decoratorFactory('messenger');
export const Messenger = messenger;
