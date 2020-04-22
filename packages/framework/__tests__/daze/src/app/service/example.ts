import { BaseService, component } from '../../../../../src';

@component('example')
export default class extends BaseService {
  sayHello() {
    return 'Hello Dazejs';
  }
}
