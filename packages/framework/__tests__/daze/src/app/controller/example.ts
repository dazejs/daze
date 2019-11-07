import {
  Controller, Route, Http,
} from '../../../../../src';


@Route('/example')
export default class extends Controller {

  @Http.Get()
  index() {
    return this.service('example').sayHello();
  }

  @Http.Post('post')
  store() {
    return {
      body: this.request.body,
      files: this.request.files,
    };
  }
}
