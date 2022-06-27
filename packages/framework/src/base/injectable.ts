import { Request } from '../http/request';
import { Base } from './base';
import { INJECTABLE } from '../symbol';

@Reflect.metadata(INJECTABLE, true)
export class Injectable extends Base {
  __context__: any[];

  /**
   * @var request request instance
   */
  get request(): Request {
    return this.__context__[0];
  }
}