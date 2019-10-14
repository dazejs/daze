
import {
  Http, Controller, Route, useService
} from '@dazejs/framework'
import ExampleService from '../service/example'

@Route('example')
export default class extends Controller {

  @useService('example') exampleService: ExampleService;

  @Http.Get()
  async index() {
    return this.exampleService.findAll()
  }

  @Http.Post()
  async store() {
    this.exampleService.add({})
    return this.response().Created()
  }
}