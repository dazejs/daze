import {
  Controller, Get, Redirect
} from '../../../../../src';


@Controller('/redirect')
export default class {
  @Get()
  show() {
    return new Redirect().go('https://www.google.com');
  }
}
