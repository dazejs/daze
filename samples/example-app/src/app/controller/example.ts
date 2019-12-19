
import {
  Http, Controller, Route
} from '@dazejs/framework';

@Route('example')
export default class extends Controller {

  @Http.Get()
  async index() {
    return this.service('example').findAll();
  }

  @Http.Post()
  async store() {
    this.service('example').add({});
    return this.response().Created();
  }
}
