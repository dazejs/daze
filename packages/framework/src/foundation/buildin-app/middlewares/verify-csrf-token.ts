/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import minimatch from 'minimatch';
import { Next } from '../../../http/middleware';
import { Request } from '../../../http/request';
import { Response } from '../../../http/response';
import { Middleware } from '../../../decorators';
import { app } from '../../../helpers';


const defaultExcludedMethods = ['HEAD', 'GET', 'OPTIONS'];
const defaultInvalidTokenMessage = 'Invalid CSRF token';

@Middleware()
export class VerifyCsrfToken {
  get except(): any[] {
    return [];
  }

  get excludedMethods() {
    return defaultExcludedMethods;
  }

  get invalidTokenMessage() {
    return defaultInvalidTokenMessage;
  }

  isReadVerb(method?: string) {
    if (!method) return false;
    const excludedMethods = Array.isArray(this.excludedMethods)
      ? this.excludedMethods
      : defaultExcludedMethods;
    return !!~excludedMethods.indexOf(method.toUpperCase());
  }

  inExcept(requestPath: string) {
    for (const except of this.except) {
      if (minimatch(requestPath, except)) return true;
    }
    return false;
  }

  tokenValidity(request: any) {
    const bodyToken = (request.body && typeof request.body._token === 'string')
      ? request.body._token : false;
    const token = bodyToken
      || request.getHeader('csrf-token')
      || request.getHeader('xsrf-token')
      || request.getHeader('x-csrf-token')
      || request.getHeader('x-xsrf-token');

    if (!token) {
      return false;
    }
    if (!app().get('csrf').verify(request.session().get('secret'), token)) {
      return false;
    }
    return true;
  }

  resolve(request: Request, next: Next) {
    const session = request.session();
    if (!session.get('secret')) {
      session.set('secret', app().get('csrf').secretSync());
    }
    request._csrf = app().get('csrf').create(session.get('secret'));
    if (
      this.isReadVerb(request.getMethod())
      || this.inExcept(request.getPath())
      || this.tokenValidity(request)
    ) {
      return next();
    }
    return new Response(this.invalidTokenMessage, 403);
  }
}