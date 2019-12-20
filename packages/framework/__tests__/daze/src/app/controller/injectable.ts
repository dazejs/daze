import {
  Controller, Route, Http
} from '../../../../../src';
import { DazeDto } from "./dto/DazeDto";

@Route('/injectable')
export default class extends Controller {
  @Http.Get()
  index(@Http.Query('id') id: number) {
    return id || 'hello world';
  }

  @Http.Get('name')
  getName(@Http.Query('id') id: number, @Http.Query('name') name: string) {
    return `${id}:${name}` || 'hello world';
  }

  @Http.Get('name/default')
  getNameDefault(@Http.Query('name', "daze") name: string) {
    return name;
  }

  @Http.Get('params')
  getParams(@Http.Params() params: any) {
    return params;
  }

  @Http.Post('body')
  getDazeBody(@Http.Body() dto: DazeDto): DazeDto {
    return dto;
  }

  @Http.Post('body2')
  getDazeBody2(@Http.Body('key2.key1') dto: DazeDto): DazeDto {
    return dto;
  }
  
  @Http.Get('header')
  getHeader(@Http.Header('my-header') host: string) {
    return host;
  }

  @Http.Get('resource')
  _resource() {
    return this.resource('injectable').item({name: 'dazejs'});
  }

  @Http.Get('service')
  _service() {
    return this.service('injectable').sayId();
  }
}
