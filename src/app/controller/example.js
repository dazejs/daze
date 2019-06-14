const { Http, Controller } = require('@dazejs/framework');

@Controller('example')
class Example {
  @Http.Get('login')
  create() {
    return view('example/login');
  }

  @Http.Post('login')
  store() {
    console.log(this.body);
    return res().Created();
  }
}

module.exports = Example;
