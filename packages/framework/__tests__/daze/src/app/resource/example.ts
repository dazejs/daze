import { BaseResource, resource } from '../../../../../src';

@resource('example-resource')
export default class extends BaseResource {
  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}

