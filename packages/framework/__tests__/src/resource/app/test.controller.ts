import { controller, BaseController, http } from '../../../../src';
import { TestResource } from './test.resource';
import { WrapResource } from './wrap.resource';

@controller('/resource')
export class TestController extends BaseController {
  @http.get('/item')
  itemAction() {
    return TestResource.item({
      name: 'dazejs'
    });
  }

  @http.get('/collection')
  collectionAction() {
    return TestResource.collection([
      {
        name: 'dazejs'
      },
      {
        name: 'dazejs'
      }
    ]);
  }


  @http.get('/wrap')
  wrapAction() {
    return new WrapResource().item({
      name: 'dazejs',
      wrap: {
        key: 'daze',
      }
    });
  }
}