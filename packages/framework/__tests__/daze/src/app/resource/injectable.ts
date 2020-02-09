import { Resource, Component, Http } from '../../../../../src';

@Component('injectable')
export default class extends Resource {
  resolve(
  @Http.Query('id') id: number,
    data: any
  ) {
    return {
      ...data,
      id,
    };
  }
}

