import {
  Controller, route, http, use
} from '../../../../../src';
import { Example1 } from '../middleware/example-1';
import { Example2 } from '../middleware/example-2';

@route('/middleware')
@use(Example2)
export class Middleware extends Controller {
  @http.get('/example1')
  @use(Example1)
  store() {
    return 'Hello Dazejs';
  }
}
