import { resourcer, BaseResource, ResourceInterface } from '../../../../src';


@resourcer()
export class TestResource extends BaseResource implements ResourceInterface {
  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}