import { Resource, Component } from '../../../../../src';

@Component('example')
export default class extends Resource {

  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}

