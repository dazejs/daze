/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatPrefix } from './helpers'

const rest = {
  index: [{ uri: '/', method: 'get' }],
  create: [{ uri: '/create', method: 'get' }],
  show: [{ uri: '/:id', method: 'get' }],
  store: [{ uri: '/', method: 'post' }],
  edit: [{ uri: '/:id/edit', method: 'get' }],
  update: [{ uri: '/:id', method: 'put' }],
  destroy: [{ uri: '/:id', method: 'del' }],
};

function injectClass(target: any, prefix: string) {
  Reflect.defineMetadata('injectable', true, target);
  Reflect.defineMetadata('prefix', formatPrefix(prefix), target);
  const routes = Reflect.getMetadata('routes', target);
  Reflect.defineMetadata('routes', {
    ...rest,
    ...routes,
  }, target);
  return target;
}

function handle(args: any[], prefix: string) {
  if (args.length === 1) {
    const [target] = args
    return injectClass(target, prefix);
  }
  throw new Error('@Rest must be decorate on Class');
}

export function Rest(prefix: string = '') {
  return (...args: any) => handle(args, prefix);
};
