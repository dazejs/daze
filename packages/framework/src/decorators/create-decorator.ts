import { decoratorFactory } from './factory/decorator-factory';

export const createCustomDecorator =
  (abstract: any, params: any[] = [], handler?: (injectedParam: any) => any) =>
    decoratorFactory(abstract, params, handler);