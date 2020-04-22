import { BaseResource, component } from '../../../../../src';

@component('example')
export default class extends BaseResource {
  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}

