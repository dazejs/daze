import {
  BaseController, controller, http
} from '../../../../../src';
import { DazeDto } from "./dto/daze.dto";

@controller('/injectable')
export default class extends BaseController {
  @http.get()
  index(@http.query('id') id: number) {
    return id || 'hello world';
  }

  @http.get('name')
  getName(@http.query('id') id: number, @http.query('name') name: string) {
    return `${id}:${name}` || 'hello world';
  }

  @http.get('name/default')
  getNameDefault(@http.query('name', "daze") name: string) {
    return name;
  }

  @http.get('params')
  getParams(@http.params() params: any) {
    return params;
  }

  @http.post('body')
  getDazeBody(@http.body() dto: DazeDto): DazeDto {
    return dto;
  }

  @http.post('body2')
  getDazeBody2(@http.body('key2.key1') dto: DazeDto): DazeDto {
    return dto;
  }
  
  @http.get('header')
  getHeader(@http.header('my-header') host: string) {
    return host;
  }
}
