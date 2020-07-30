import { BaseResource, resource } from '../../../../../src';

@resource()
export default class extends BaseResource {
  resolve(data: any) {
    return {
      ...data,
      type: 'node',
    };
  }
}

