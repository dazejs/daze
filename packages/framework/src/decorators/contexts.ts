import { createInjectDecorator } from './factory/create-inject-decorator';

export const config = (key?: string, defaultValue?: any) =>
  createInjectDecorator('config', [key], (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key, defaultValue);
    }
  });

export const app = () => createInjectDecorator('app');
export const messenger = () => createInjectDecorator('messenger');
