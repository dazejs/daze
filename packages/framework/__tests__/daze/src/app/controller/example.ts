import {
  Controller, Get, Autowired, Post, request, View
} from '../../../../../src';
import ExampleService from '../service/example';


@Controller('/example')
export default class {
  @Autowired
    exampleService: ExampleService;

  @Get('/template')
  template() {
    return new View('hello', {
      name: 'dazejs'
    });
  }

  @Get()
  index() {
    return this.exampleService.sayHello();
  }

  @Post('post')
  store() {
    return {
      body: request().body,
      files: request().files,
    };
  }

  @Get('/null')
  sayNull() {
    return null;
  }

  @Get('/number')
  sayNumber(): number {
    return 0;
  }

  @Get('/boolean')
  sayBoolean(): boolean {
    return true;
  }

}
