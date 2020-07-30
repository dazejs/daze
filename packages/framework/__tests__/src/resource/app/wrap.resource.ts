import { resource, BaseResource, ResourceInterface } from '../../../../src';
import { TestResource } from './test.resource';

@resource()
export class WrapResource extends BaseResource implements ResourceInterface {
  resolve(data: any) {
    return {
      ...data,
      wrap: TestResource.item(data.wrap)
    };
  }
}