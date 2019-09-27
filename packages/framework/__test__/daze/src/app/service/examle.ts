import { Service, Component } from '../../../../../src';

@Component('example')
export default class extends Service {
  sayHello() {
    return 'Hello Dazejs';
  }
}
