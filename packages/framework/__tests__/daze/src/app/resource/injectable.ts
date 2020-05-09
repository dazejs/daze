import { BaseResource, http, resource } from '../../../../../src';

@resource('injectable-resource')
export default class extends BaseResource {
  resolve(@http.query('id') id: number, data: any) {
    return {
      ...data,
      id,
    };
  }
}

