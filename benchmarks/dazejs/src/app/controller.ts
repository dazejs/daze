import { Controller, Route, Http } from '@dazejs/framework'

@Route()
export default class extends Controller {
  @Http.Get('hello')
  hello() {
    return 'Hello World'
  }
}