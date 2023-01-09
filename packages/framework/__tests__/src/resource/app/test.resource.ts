import { Resourcer, BaseResource, ResourceInterface } from '../../../../src';


@Resourcer()
export class TestResource extends BaseResource implements ResourceInterface {
  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}