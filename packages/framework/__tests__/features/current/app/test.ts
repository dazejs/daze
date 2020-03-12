import { Controller, http, route } from '../../../../src';

@route('/features/current')
export class App extends Controller {
  @http.get()
  index() {
    return 'hello current';
  }
}