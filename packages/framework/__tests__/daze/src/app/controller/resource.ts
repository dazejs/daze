import {
  BaseController, controller, http,
} from '../../../../../src';
import ExampleResource from '../resource/example';


@controller('/resource')
export default class extends BaseController {
  @http.get('item')
  show() {
    return ExampleResource.item({
      name: 'dazejs',
    });
  }

  @http.get('collection')
  index() {
    return ExampleResource.collection([{
      name: 'dazejs',
    }, {
      name: 'dazejs',
    }]);
  }
}
