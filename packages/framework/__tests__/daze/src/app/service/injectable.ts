import { Query, Service } from '../../../../../src';


@Service('injectable-service')
export default class {
  sayId(
  @Query('id') id: number
  ) {
    return id ?? 'Hello Dazejs';
  }
}
