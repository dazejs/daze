import {
  Controller, Route, Http
} from '../../../../../src';

@Route('/injectable')
export default class extends Controller {
  @Http.Get()
  index(
    @Http.Query('id') id: number
  ) {
    return id || 'hello world';
  }

  @Http.Get('resource')
  _resource() {
    return this.resource('injectable').item({ name: 'dazejs' });
  }

  @Http.Get('service')
  _service() {
    return this.service('injectable').sayId();
  }
}
