import { Base } from './base';

export abstract class Agent extends Base {
  abstract resolve(): Promise<any> | any
}