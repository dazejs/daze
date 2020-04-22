import {
  BaseController, controller, http,
} from '../../../../../src';


@controller('/resource')
export default class extends BaseController {
  @http.get('item')
  show() {
    return this.resource('example').item({
      name: 'dazejs',
    });
  }

  @http.get('collection')
  index() {
    return this.resource('example').collection([{
      name: 'dazejs',
    }, {
      name: 'dazejs',
    }]);
  }
}
