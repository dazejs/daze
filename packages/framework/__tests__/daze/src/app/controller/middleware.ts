import {
  Controller, Get, UseMiddleware
} from '../../../../../src';
import { Example1 } from '../middleware/example-1';
import { Example2 } from '../middleware/example-2';

@Controller('/middleware')
@UseMiddleware(Example2)
export class MiddlewareController {
  @Get('/example1')
  @UseMiddleware(Example1)
  store() {
    return 'Hello Dazejs';
  }
}
