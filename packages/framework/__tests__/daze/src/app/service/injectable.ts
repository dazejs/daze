import { BaseService, http, service } from '../../../../../src';


@service('injectable-service')
export default class extends BaseService {
  sayId(
  @http.query('id') id: number
  ) {
    return id ?? 'Hello Dazejs';
  }
}
