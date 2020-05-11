import {
  controller, http, useMiddleware
} from '../../../../../src';
import { Example1 } from '../middleware/example-1';
import { Example2 } from '../middleware/example-2';

@controller('/middleware')
@useMiddleware(Example2)
export class Middleware {
  @http.get('/example1')
  @useMiddleware(Example1)
  store() {
    return 'Hello Dazejs';
  }
}
