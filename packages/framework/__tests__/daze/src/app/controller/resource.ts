import {
  Controller, Route, Http,
} from '../../../../../src';


@Route('/resource')
export default class extends Controller {
  @Http.Get('item')
  show() {
    return this.resource('example').item({
      name: 'dazejs',
    });
  }

  @Http.Get('collection')
  index() {
    return this.resource('example').collection([{
      name: 'dazejs',
    }, {
      name: 'dazejs',
    }]);
  }
}
