/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import * as http from 'http';

import { formatPrefix } from './helpers';

function decorateMethod(target: any, name: string, descriptor: any, methods: any, uri: string) {
  const routes = Reflect.getMetadata('routes', target.constructor) || {};
  if (!routes[name]) routes[name] = [];
  for (const method of methods) {
    routes[name].push({
      uri: formatPrefix(uri),
      method,
    });
  }
  Reflect.defineMetadata('routes', routes, target.constructor);
  return descriptor;
}

function handle(args: any[], methods: any[], uri = '') {
  if (args.length > 1) {
    const [target, name, descriptor] = args;
    return decorateMethod(target, name, descriptor, methods, uri);
  }
  throw new Error('@Http[method] must be decorate on method');
}

function verb(methods: any[], uri = '/') {
  return (...args: any[]) => handle(args, methods, uri);
}

export function get(uri = '') {
  return verb(['GET'], uri);
};

export function post(uri = '') {
  return verb(['POST'], uri);
};

export function put(uri = '') {
  return verb(['PUT'], uri);
};

export function patch(uri = '') {
  return verb(['PATCH'], uri);
};


export function options(uri = '') {
  return verb(['OPTIONS'], uri);
};

export function head(uri = '') {
  return verb(['HEAD'], uri);
};

export function del(uri = '') {
  return verb(['DELETE'], uri);
};

export function all(uri = '', methods: any[] = http.METHODS) {
  return verb(methods, uri);
};
