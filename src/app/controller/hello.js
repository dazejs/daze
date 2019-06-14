
const {
  Controller, Http, useService, HttpRequest, SessionValue,
  CookieValue, useMiddleware, Response, CrossOrigin,
} = require('@dazejs/framework');

@Controller()
class Hello {
  @Http.Get('hello')
  @useService('user')
  index(aaa) {
    console.log(aaa, 'aaa');
    return { name: 'dazejs' };
  }
}

module.exports = Hello;
