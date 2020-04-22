import {
  controller, http, csrf,
} from '../../../../../src';

@controller('/csrf')
export default class {
  @http.post()
  @csrf()
  store() {
    return 'hello';
  }

  @http.get('/get')
  @csrf()
  show() {
    return 'hello';
  }
}
