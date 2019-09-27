import {
  Controller, Route, Http, Csrf,
} from '../../../../../src';


@Route('/csrf')
export default class extends Controller {
  @Http.Post()
  @Csrf()
  store() {
    return 'hello';
  }

  @Http.Get('/get')
  @Csrf()
  show() {
    return 'hello';
  }
}
