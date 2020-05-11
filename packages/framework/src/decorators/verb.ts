/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as http from 'http';
import { formatPrefix } from './helpers';

function verb(methods: any[], uri = '/'): MethodDecorator {
  return function (target, propertyKey) {
    const routes = Reflect.getMetadata('routes', target.constructor) || {};
    if (!routes[propertyKey]) routes[propertyKey] = [];
    for (const method of methods) {
      routes[propertyKey].push({
        uri: formatPrefix(uri),
        method,
      });
    }
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
}

export const get = function (uri = '') {
  return verb(['GET'], uri);
};
export const Get = get;

export const post = function (uri = '') {
  return verb(['POST'], uri);
};
export const Post = post;

export const put = function (uri = '') {
  return verb(['PUT'], uri);
};
export const Put = put;

export const patch = function (uri = '') {
  return verb(['PATCH'], uri);
};
export const Patch = patch;

export const options = function (uri = '') {
  return verb(['OPTIONS'], uri);
};
export const Options = options;

export const head = function (uri = '') {
  return verb(['HEAD'], uri);
};
export const Head = head;

export const del = function (uri = '') {
  return verb(['DELETE'], uri);
};
export const Del = del;

export const all = function (uri = '', methods: any[] = http.METHODS) {
  return verb(methods, uri);
};
export const All = all;
