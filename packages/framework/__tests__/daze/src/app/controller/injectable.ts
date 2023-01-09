import {
  Controller, Get, Query, Params, Body, Header, Post
} from '../../../../../src';
import { DazeDto } from "./dto/daze.dto";

@Controller('/injectable')
export default class {
  @Get()
  index(@Query('id') id: number) {
    return id || 'hello world';
  }

  @Get('name')
  getName(@Query('id') id: number, @Query('name') name: string) {
    return `${id}:${name}` || 'hello world';
  }

  @Get('name/default')
  getNameDefault(@Query('name', "daze") name: string) {
    return name;
  }

  @Get('params')
  getParams(@Params() params: any) {
    return params;
  }

  @Post('body')
  getDazeBody(@Body() dto: DazeDto): DazeDto {
    return dto;
  }

  @Post('body2')
  getDazeBody2(@Body('key2.key1') dto: DazeDto): DazeDto {
    return dto;
  }
  
  @Get('header')
  getHeader(@Header('my-header') host: string) {
    return host;
  }
}
