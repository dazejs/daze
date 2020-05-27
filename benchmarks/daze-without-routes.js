const { Application, Controller, BaseProvider, Response } = require('../packages/framework/dist')

const app = new Application(__dirname)


class RoutesProvider extends BaseProvider {
  launch() {
    this.app.get('middleware').register(() => (new Response()).OK('Hello World'))
  }
}

app.disableBodyParser()

app.disableSession()

app.register(new RoutesProvider(app))

app.run(3000)


