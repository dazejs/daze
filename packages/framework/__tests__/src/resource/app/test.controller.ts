import { controller, BaseController, http, useItemResource, useCollectionResource } from '../../../../src';
import { TestResource } from './test.resource';

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

  @http.get('/useItemResource')
  @useItemResource(TestResource)
  useItemResourceAction() {
    return {
      name: 'dazejs'
    };
  }

  @http.get('/useCollectionResource')
  @useCollectionResource(TestResource)
  useCollectionResourceAction() {
    return [
      {
        name: 'dazejs'
      },
      {
        name: 'dazejs'
      }
    ];
  }
}