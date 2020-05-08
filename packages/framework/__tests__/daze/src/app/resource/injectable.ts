import { BaseResource, http, component } from '../../../../../src';

@component('injectable')
export default class extends BaseResource {
  resolve(@http.query('id') id: number, data: any) {
    return {
      ...data,
      id,
    };
  }
}

