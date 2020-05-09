/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import { createInjectDecorator } from './factory/create-inject-decorator';

export const config = (key?: string, defaultValue?: any) =>
  createInjectDecorator('config', [key], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key, defaultValue);
    }
  });
export const Config = config;

export const app = () => createInjectDecorator('app');
export const App = app;

export const messenger = () => createInjectDecorator('messenger');
export const Messenger = messenger;
