import { Base } from './base';
import { ComponentType } from '../symbol';

@Reflect.metadata('type', ComponentType.Model)
export abstract class Model extends Base {
 
}