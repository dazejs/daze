import { Controller, response, Request, Get } from '../../../../src';
import { TestValidator } from './test.validator';

@Controller('/validate')
export class TestController {
  @Get('/test1')
  test1(request: Request) {
    request.validate(TestValidator);
    return 'hello dazejs';
  }

  @Get('/test3')
  test3(request: Request) {
    if (!TestValidator.check(request.getParams())) {
      return response().badRequest();
    }
    return 'hello dazejs';
  }

  @Get('/test4')
  test4(request: Request) {
    try {
      request.validate(TestValidator);
    } catch (err) {
      return response().badRequest();
    }
    return 'hello dazejs';
  }

  @Get('/test5')
  test5(request: Request) {
    const validate = new TestValidator().make(request.getParams());
    if (validate.fails) {
      return response().badRequest();
    }
    return 'hello dazejs';
  }
}