import {
  Controller, Get
} from '../../../../../src';
import ExampleService from '../service/example';

@Controller('autoinject')
export default class {
  @Get()
  index(example: ExampleService) {
    return example.sayHello();
  }
}
