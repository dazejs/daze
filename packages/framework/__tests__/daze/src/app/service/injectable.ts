import { Service, Component, Http } from '../../../../../src';

@Component('injectable')
export default class extends Service {
  sayId(
    @Http.Query('id') id: number
  ) {
    return id ?? 'Hello Dazejs';
  }
}
