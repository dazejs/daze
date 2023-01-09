import {
  CrossOrigin, Controller, Post,
} from '../../../../../src';

@Controller('cross')
export default class {
  @Post()
  @CrossOrigin()
  store() {
    return 'hello';
  }
}
