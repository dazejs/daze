import { Request, Next, Middleware, Response } from '../../../../../src';

@Middleware()
export class Example1 {
  resolve(request: Request, next: Next) {
    if (request.getQuery('name') === 'example1') {
      return new Response().success('Hello Example1');
    }
    return next();
  }
}