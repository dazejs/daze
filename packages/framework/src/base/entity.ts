// import { inspect } from 'util';
// import { Base } from '../base';
import { ComponentType } from '../symbol';
import { Model } from '../model/model';

@Reflect.metadata('type', ComponentType.Entity)
@Reflect.metadata('connection', 'default')
export class Entity extends Model {

}