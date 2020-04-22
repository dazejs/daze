import { BaseService, http, component } from '../../../../../src';


@component('injectable')
export default class extends BaseService {
  sayId(
  @http.query('id') id: number
  ) {
    return id ?? 'Hello Dazejs';
  }
}
