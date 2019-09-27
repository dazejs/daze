import {
  Controller, Route, Http, useService,
} from '../../../../../src';


@Route('/example')
export default class extends Controller {
  @useService('example') userService: any;

  @Http.Get()
  index() {
    return this.userService.sayHello();
  }

  @Http.Post('post')
  store() {
    return {
      body: this.request.body,
      files: this.request.files,
    };
  }
}
