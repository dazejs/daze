
const {
  Route, Http, Controller,
} = require('@dazejs/framework');

@Route()
class Hello extends Controller {
  @Http.Get()
  index() {
    return this.render('hello', {
      name: 'Daze.js',
    });
  }

  @Http.Post('/post')
  store() {
    return this.request.body || {};
  }
}


module.exports = Hello;
