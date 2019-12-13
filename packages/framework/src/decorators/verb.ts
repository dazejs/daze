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

function Verb(methods: any[], uri = '/') {
  return (...args: any[]) => handle(args, methods, uri);
}

export function Get(uri = '') {
  return Verb(['GET'], uri);
};

export function get(uri = '') {
  return Get(uri);
};

export function Post(uri = '') {
  return Verb(['POST'], uri);
};

export function post(uri = '') {
  return Post(uri);
};

export function Put(uri = '') {
  return Verb(['PUT'], uri);
};

export function put(uri = '') {
  return Put(uri);
};

export function Patch(uri = '') {
  return Verb(['PATCH'], uri);
};

export function patch(uri = '') {
  return Patch(uri);
};

export function Options(uri = '') {
  return Verb(['OPTIONS'], uri);
};

export function options(uri = '') {
  return Options(uri);
};

export function Head(uri = '') {
  return Verb(['HEAD'], uri);
};

export function head(uri = '') {
  return Head(uri);
};

export function Delete(uri = '') {
  return Verb(['DELETE'], uri);
};

export function del(uri = '') {
  return Delete(uri);
};

export function Del(uri = '') {
  return Delete(uri);
};

export function All(uri = '', methods: any[] = http.METHODS) {
  return Verb(methods, uri);
};

export function all(uri = '', methods: any[] = http.METHODS) {
  return All(uri, methods);
};
