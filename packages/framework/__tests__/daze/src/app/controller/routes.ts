import {
  controller, http,
} from '../../../../../src';

@controller('routes')
export default class {
  @http.get('*')
  all1() {
    return 'all1';
  }

  @http.get('all2')
  all2() {
    return 'all2';
  }
}
