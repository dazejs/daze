import { Service } from '../../../../../src';

@Service('example-service')
export default class {
  sayHello() {
    return 'Hello Dazejs';
  }
}
