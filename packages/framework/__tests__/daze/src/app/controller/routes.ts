import {
  Controller, Get,
} from '../../../../../src';

@Controller('routes')
export default class {
  @Get('*')
  all1() {
    return 'all1';
  }

  @Get('all2')
  all2() {
    return 'all2';
  }
}
