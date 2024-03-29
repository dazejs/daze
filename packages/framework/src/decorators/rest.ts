/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { Str } from '../utils';
import { INJECTABLE } from '../symbol';

const defaultRestRoutes = {
  index: [{ uri: '/', method: 'get' }],
  create: [{ uri: '/create', method: 'get' }],
  show: [{ uri: '/:id', method: 'get' }],
  store: [{ uri: '/', method: 'post' }],
  edit: [{ uri: '/:id/edit', method: 'get' }],
  update: [{ uri: '/:id', method: 'put' }],
  destroy: [{ uri: '/:id', method: 'delete' }],
};

export const Rest = function (...prefixs: string[]): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata(INJECTABLE, true, constructor);
    Reflect.defineMetadata('prefixs', prefixs?.map(prefix => Str.formatPrefix(prefix)) ?? ['/'], constructor);
    const routes = Reflect.getMetadata('routes', constructor);
    Reflect.defineMetadata('routes', {
      ...defaultRestRoutes,
      ...routes,
    }, constructor);
  };
};
