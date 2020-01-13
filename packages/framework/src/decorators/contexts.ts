import { createInjectDecorator } from './factory/create-inject-decorator';

export const Config = (key?: string, defaultValue?: any) =>
  createInjectDecorator('config', (injectedParam: any) => {
    if (typeof injectedParam === 'undefined' || !key) {
      return defaultValue ?? injectedParam;
    } else {
      return injectedParam.get(key, defaultValue);
    }
  })(key);
export const config = Config;

export const App = createInjectDecorator('app');
export const app = App;
export const Messenger = createInjectDecorator('messenger');
export const messenger = Messenger;
