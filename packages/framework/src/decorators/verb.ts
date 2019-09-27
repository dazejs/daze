/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import http from 'http'
import { formatPrefix } from './helpers'

function decorateMethod(target: any, name: string, descriptor: any, methods: any, uri: string) {
  const routes = Reflect.getMetadata('routes', target) || {};
  if (!routes[name]) routes[name] = [];
  for (const method of methods) {
    routes[name].push({
      uri: formatPrefix(uri),
      method,
    });
  }
  Reflect.defineMetadata('routes', routes, target);
  return descriptor;
}

function handle(args: any[], methods: any[], uri: string = '') {
  if (args.length > 1) {
    const [target, name, descriptor] = args
    return decorateMethod(target, name, descriptor, methods, uri);
  }
  throw new Error('@Http[method] must be decorate on method');
}

function Verb(methods: any[], uri = '/') {
  return (...args: any[]) => handle(args, methods, uri);
}

export function Get(uri: string = '') {
  return Verb(['GET'], uri);
};

export function Post(uri: string = '') {
  return Verb(['POST'], uri);
};

export function Put(uri: string = '') {
  return Verb(['PUT'], uri);
};

export function Patch(uri: string = '') {
  return Verb(['PATCH'], uri);
};

export function Options(uri: string = '') {
  return Verb(['OPTIONS'], uri);
};

export function Head(uri: string = '') {
  return Verb(['HEAD'], uri);
};

export function Delete(uri: string = '') {
  return Verb(['DELETE'], uri);
};

export function Del(uri: string = '') {
  return Verb(['DEL'], uri);
};

export function All(uri: string = '', methods: any[] = http.METHODS) {
  return Verb(methods, uri);
};
