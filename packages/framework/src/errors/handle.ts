/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import tracePage from '@dazejs/trace-page';
import statuses from 'statuses';
import * as typeis from 'type-is';
import { Container } from '../container';
import { Application } from '../foundation/application';
import { Request } from '../http/request';
import { Response } from '../http/response';
import { Redirect } from '../http/response/redirect';
import { View } from '../view';
import { HttpError } from './http-error';
import { ValidateHttpError } from './validate-http-error';

// import { OutgoingHttpHeaders } from 'http';

const defaultHttpErrorTemplate = {
  401: 'errors/401.njk',
  404: 'errors/404.njk',
  500: 'errors/500.njk',
  503: 'errors/503.njk',
};

const renderTypes = ['html', 'text', 'json'];

export interface ErrorOptionProperty { 
  render?: Function; 
  report?: Function;
}

export type ErrorCollection = (Error & ErrorOptionProperty) | (HttpError & ErrorOptionProperty);

export class ErrorHandler {
  /**
   * app Application instance
   */
  app: Application = Container.get('app');

  request?: Request;

  error: ErrorCollection;

  /**
   * Create Application Error Handler
   */
  constructor(error: ErrorCollection, request?: Request) {
    /**
     * request request instance
     */
    this.request = request;

    /**
     * error thrown Error
     */
    this.error = error;

  }

  /**
   * report error
   */
  report() {
    if (this.error instanceof HttpError) return;
    this.app.emit('error', this.error, this.request);
  }


  /**
   * render error response
   * @public
   */
  render() {
    if (this.error instanceof HttpError) {
      const contentType = this.error.headers?.['content-type'] as string ?? this.request?.getHeader('content-type') ?? '';
      const headersType = typeis.is(contentType, ['html', 'text', 'json']) || 'text';
      if (headersType && renderTypes.includes(headersType)) {
        return this[headersType as 'html' | 'text' | 'json']();
      }
    }

    const acceptsType = this.request?.acceptsTypes('html', 'text', 'json');
    if (typeof acceptsType === 'string' && renderTypes.includes(acceptsType)) {
      return this[acceptsType as 'html' | 'text' | 'json']();
    }

    return this.text();
  }

  /**
   * render error response when text type
   * @private
   */
  text() {
    if (this.error instanceof HttpError) {
      const data = this.error.message || statuses[+this.error.code || 500];
      return new Response(data, this.error.code, this.error.headers).setType('txt');
    }

    const data = this.error.message || 'something went error!';
    return new Response(data, 500).setType('txt');
  }

  /**
   * render error response when json type
   * @private
   */
  json() {
    if (this.error instanceof HttpError) {
      const message = this.error.message || statuses[+this.error.code || 500];
      const { errors } = this.error;
      const data: Record<string, any> = { message, errors };
      if (this.app.isDebug) {
        if (this.error.code >= 500) {
          data.stack = this.error.stack;
        }
      }
      return new Response(data, this.error.code, this.error.headers).setType('json');
    }

    const data: Record<string, any> = { message: this.error.message || 'something went error!' };
    if (this.app.isDebug) {
      data.stack = this.error.stack;
    }
    return new Response(data, 500).setType('json');
  }

  /**
   * render error response when html type
   * @private
   */
  html() {
    if (this.error instanceof ValidateHttpError) {
      // this.ctx.status = 302;
      // const url = this.ctx.session[SESSION_PREVIOUS_URL] || this.ctx.get('Referrer') || '/';
      // this.ctx.response.set('Location', url);
      // return undefined;
      // TODO: session
      return (new Redirect()).back();
    }
    if (!(this.error instanceof HttpError)) {
      if (this.app.isDebug) {
        return this.renderTracePage(this.error);
      }
      return this.renderErrorPage(this.error);
    }
    return this.renderHttpErrorPage(this.error);
  }

  /**
   * render trace page for debug
   * @private
   */
  private renderTracePage(error: Error & ErrorOptionProperty) {
    const page = tracePage(error, this.request);
    return new Response(page, 500).setType('html');
  }

  /**
   * render error page
   * @param error 
   */
  private renderErrorPage(error: Error & ErrorOptionProperty) {
    const config = this.app.get('config');
    // get http_exception_template object
    const httpErrorTemplate = config.get('app.httpErrorTemplate', {});
    const temps = Object.assign({}, defaultHttpErrorTemplate, httpErrorTemplate);
    const view = (new View()).render(temps[500], {
      err: error,
    });
    return new Response(view, 500).setType('html');
  }

  /**
   * render http error page
   */
  private renderHttpErrorPage(error: HttpError & ErrorOptionProperty) {
    const config = this.app.get('config');
    // get http_exception_template object
    const httpErrorTemplate = config.get('app.httpErrorTemplate', {});
    const temps = Object.assign({}, defaultHttpErrorTemplate, httpErrorTemplate);
    // check user config s status page
    if (temps[error.code]) {
      const view = (new View()).render(temps[error.code], {
        err: error,
      });
      return new Response(view, error.code, error.headers).setType('html');
    }
    if (temps.error) {
      const view = (new View()).render(temps.error, {
        err: error,
      });
      return new Response(view, error.code, error.headers).setType('html');
    }
    const view = (new View()).render('errors/error.njk', {
      err: error,
    });
    return new Response(view, error.code, error.headers).setType('html');
  }
}
