import { BaseMiddleware, Request, TNext } from '../../../../../src';

export class Example2 extends BaseMiddleware {
  resolve(request: Request, next: TNext) {
    if (request.getQuery('name') === 'example2') {
      return this.response().success('Hello Example2');
    }
    return next();
  }
}