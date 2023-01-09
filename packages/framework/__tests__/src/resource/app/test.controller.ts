import { Controller, Get } from '../../../../src';
import { TestResource } from './test.resource';
import { WrapResource } from './wrap.resource';

@Controller('/resource')
export class TestController {
  @Get('/item')
  itemAction() {
    return TestResource.item({
      name: 'dazejs'
    });
  }

  @Get('/collection')
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


  @Get('/wrap')
  wrapAction() {
    return new WrapResource().item({
      name: 'dazejs',
      wrap: {
        key: 'daze',
      }
    });
  }
}