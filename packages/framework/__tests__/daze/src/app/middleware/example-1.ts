import { BaseMiddleware, Request, Next } from '../../../../../src';

export class Example1 extends BaseMiddleware {
  resolve(request: Request, next: Next) {
    if (request.getQuery('name') === 'example1') {
      return this.response().success('Hello Example1');
    }
    return next();
  }
}