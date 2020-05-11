import {
  BaseController, controller, http,
} from '../../../../../src';


@controller('/redirect')
export default class extends BaseController {
  @http.get()
  show() {
    return this.redirect().go('https://www.google.com');
  }
}
