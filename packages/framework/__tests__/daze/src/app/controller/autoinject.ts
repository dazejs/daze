import {
  controller, http
} from '../../../../../src';
import ExampleService from '../service/example';

@controller('autoinject')
export default class {
  @http.get()
  index(example: ExampleService) {
    return example.sayHello();
  }
}
