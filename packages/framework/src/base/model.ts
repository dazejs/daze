import { Base } from '../base';
// import { Builder } from '../database/builder';
import { ComponentType } from '../symbol';
// import { ModelBuilder } from '../model/builder';


@Reflect.metadata('type', ComponentType.Model)
@Reflect.metadata('primaryKey', 'id')
@Reflect.metadata('connection', 'default')
export abstract class Model extends Base {

}