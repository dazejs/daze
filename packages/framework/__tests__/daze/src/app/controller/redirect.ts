import {
  Controller, Route, Http,
} from '../../../../../src';


@Route('/redirect')
export default class extends Controller {
  @Http.Get()
  show() {
    return this.redirect().go('https://www.google.com');
  }
}
