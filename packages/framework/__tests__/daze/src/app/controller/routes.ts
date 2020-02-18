import {
  Controller, Route, Http,
} from '../../../../../src';

@Route('routes')
export default class extends Controller {
  @Http.Get('*')
  all1() {
    return 'all1';
  }

  @Http.Get('all2')
  all2() {
    return 'all2';
  }
}
