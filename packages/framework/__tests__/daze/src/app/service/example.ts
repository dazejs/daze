import { BaseService, service } from '../../../../../src';

@service('example-service')
export default class extends BaseService {
  sayHello() {
    return 'Hello Dazejs';
  }
}
