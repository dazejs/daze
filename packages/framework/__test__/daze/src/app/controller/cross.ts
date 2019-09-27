import {
  CrossOrigin, Controller, Route, Http,
} from '../../../../../src';

@Route('cross')
export default class extends Controller {
  @Http.Post()
  @CrossOrigin()
  store() {
    return 'hello';
  }
}
