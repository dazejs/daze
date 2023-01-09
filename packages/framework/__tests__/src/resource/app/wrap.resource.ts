import { Resourcer, BaseResource, ResourceInterface } from '../../../../src';
import { TestResource } from './test.resource';

@Resourcer()
export class WrapResource extends BaseResource implements ResourceInterface {
  resolve(data: any) {
    return {
      ...data,
      wrap: TestResource.item(data.wrap)
    };
  }
}