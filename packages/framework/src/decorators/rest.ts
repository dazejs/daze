/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers';

const defaultRestRoutes = {
  index: [{ uri: '/', method: 'get' }],
  create: [{ uri: '/create', method: 'get' }],
  show: [{ uri: '/:id', method: 'get' }],
  store: [{ uri: '/', method: 'post' }],
  edit: [{ uri: '/:id/edit', method: 'get' }],
  update: [{ uri: '/:id', method: 'put' }],
  destroy: [{ uri: '/:id', method: 'del' }],
};

export function Rest(prefix = ''): ClassDecorator {
  return function (constructor) {
    Reflect.defineMetadata('injectable', true, constructor);
    Reflect.defineMetadata('prefix', formatPrefix(prefix), constructor);
    const routes = Reflect.getMetadata('routes', constructor);
    Reflect.defineMetadata('routes', {
      ...defaultRestRoutes,
      ...routes,
    }, constructor);
    return constructor;
  };
};

export function rest(prefix = ''): ClassDecorator {
  return Rest(prefix);
}
