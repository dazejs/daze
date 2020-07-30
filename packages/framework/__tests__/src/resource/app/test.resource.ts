import { resource, BaseResource, ResourceInterface } from '../../../../src';


@resource()
export class TestResource extends BaseResource implements ResourceInterface {
  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}