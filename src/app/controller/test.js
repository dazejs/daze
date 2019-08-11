
const {
  Controller, Http,
} = require('@dazejs/framework');

@Controller('test')
class Hello {
  @Http.Post()
  index() {
    return this.request.body || {};
  }
}

module.exports = Hello;
