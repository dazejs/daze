/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as http from 'http';
import { Str } from '../utils';

function verb(methods: any[], uri = '/'): MethodDecorator {
  return function (target, propertyKey) {
    const routes = Reflect.getMetadata('routes', target.constructor) || {};
    if (!routes[propertyKey]) routes[propertyKey] = [];
    for (const method of methods) {
      routes[propertyKey].push({
        uri: Str.formatPrefix(uri),
        method,
      });
    }
    Reflect.defineMetadata('routes', routes, target.constructor);
  };
}

export const Get = function (uri = '') {
  return verb(['GET'], uri);
};

export const Post = function (uri = '') {
  return verb(['POST'], uri);
};

export const Put = function (uri = '') {
  return verb(['PUT'], uri);
};

export const Patch = function (uri = '') {
  return verb(['PATCH'], uri);
};

export const Options = function (uri = '') {
  return verb(['OPTIONS'], uri);
};

export const Head = function (uri = '') {
  return verb(['HEAD'], uri);
};

export const Del = function (uri = '') {
  return verb(['DELETE'], uri);
};

export const All = function (uri = '', methods: any[] = http.METHODS) {
  return verb(methods, uri);
};
