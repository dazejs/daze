import {
  BaseController, controller, http, autowired
} from '../../../../../src';
import ExampleService from '../service/example';


@controller('/example')
export default class extends BaseController {
  @autowired
  exampleService: ExampleService;

  @http.get('/template')
  template() {
    return this.render('hello', {
      name: 'dazejs'
    });
  }

  @http.get()
  index() {
    return this.exampleService.sayHello();
  }

  @http.post('post')
  store() {
    return {
      body: this.request.body,
      files: this.request.files,
    };
  }

  @http.get('/null')
  sayNull() {
    return null;
  }

  @http.get('/number')
  sayNumber(): number {
    return 0;
  }

  @http.get('/boolean')
  sayBoolean(): boolean {
    return true;
  }

}
