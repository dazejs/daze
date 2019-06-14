
const { Controller, Http } = require('@dazejs/framework');

@Controller('/')
class Aaa {
  @Http.Get('/favicon.ico')
  favicon() {
    return 'test';
  }
}

module.exports = Aaa;
