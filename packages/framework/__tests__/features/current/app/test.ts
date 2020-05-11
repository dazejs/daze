import { BaseController, http, controller } from '../../../../src';

@controller('/features/current')
export class App extends BaseController {
  @http.get()
  index() {
    return 'hello current';
  }
}