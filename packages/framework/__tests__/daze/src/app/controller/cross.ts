import {
  crossOrigin, controller, http,
} from '../../../../../src';

@controller('cross')
export default class {
  @http.post()
  @crossOrigin()
  store() {
    return 'hello';
  }
}
