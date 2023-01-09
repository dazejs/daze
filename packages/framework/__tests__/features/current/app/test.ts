import { Get, Controller } from '../../../../src';

@Controller('/features/current')
export class App {
  @Get()
  index() {
    return 'hello current';
  }
}