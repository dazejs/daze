import {
  Controller, Post, Get, Csrf,
} from '../../../../../src';

@Controller('/csrf')
export default class {
  @Post()
  @Csrf()
  store() {
    return 'hello';
  }

  @Get('/get')
  @Csrf()
  show() {
    return 'hello';
  }
}
