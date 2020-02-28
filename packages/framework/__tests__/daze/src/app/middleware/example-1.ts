import { Middleware, Request, TNext } from '../../../../../src';

export class Example1 extends Middleware {
  resolve(request: Request, next: TNext) {
    if (request.getQuery('name') === 'example1') {
      return this.response().success('Hello Example1');
    }
    return next();
  }
}