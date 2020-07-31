import { controller, BaseController, http, Request, useValidator } from '../../../../src';
import { TestValidator } from './test.validator';

@controller('/validate')
export class TestController extends BaseController {
  @http.get('/test1')
  test1(request: Request) {
    request.validate(TestValidator);
    return 'hello dazejs';
  }

  @http.get('/test2')
  @useValidator(TestValidator)
  test2() {
    return 'hello dazejs';
  }

  @http.get('/test3')
  test3(request: Request) {
    if (!TestValidator.check(request.getParams())) {
      return this.response().badRequest();
    }
    return 'hello dazejs';
  }

  @http.get('/test4')
  test4(request: Request) {
    try {
      request.validate(TestValidator);
    } catch (err) {
      return this.response().badRequest();
    }
    return 'hello dazejs';
  }

  @http.get('/test5')
  test5(request: Request) {
    const validate = new TestValidator().make(request.getParams());
    if (validate.fails) {
      return this.response().badRequest();
    }
    return 'hello dazejs';
  }
}