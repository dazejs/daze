import { Request, Next, Middleware, Response } from '../../../../../src';

@Middleware()
export class Example2 {
  resolve(request: Request, next: Next) {
    if (request.getQuery('name') === 'example2') {
      return new Response().success('Hello Example2');
    }
    return next();
  }
}