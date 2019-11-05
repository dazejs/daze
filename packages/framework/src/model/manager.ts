
// import pluralize from 'pluralize'
import { Container } from '../container';
import { Application } from '../foundation/application';
import { Model as BaseModel } from '../base/model';
import { ComponentType } from '../symbol';

export class ModelManager {

  app: Application = Container.get('app')

  wrap(name: string) {
    return `model.${name}`;
  }

  register(Model: typeof BaseModel) {
    if (Reflect.getMetadata('type', Model) !== ComponentType.Model) return this;
    const name = Reflect.getMetadata('name', Model);
    const columns = Reflect.getMetadata('columns', Model);
    
    const model = this.app.get<BaseModel>(Model);

    this.app.multiton(`${this.wrap(name)}`, () => {
      return model.db(
        model.connection || 'default'
      ).table(
        model.table
      ).columns(...columns);
    }, true);

    return this;
  }



  // // 数据
  // data: any = {};

  // // 模型对应的表名
  // table: string;

  // connection: string;

  // constructor(data: any = {}) {
  //   this.data = data;

  //   // 初始化 table
  //   if (!this.table) {
  //     this.table = pluralize(this.table.toLowerCase())
  //   }

  //   return new Proxy(this, this.proxy)
  // }
  
  // get proxy(): ProxyHandler<this> {
  //   return {
  //     get(target: any, p: string | number | symbol, receiver: any ) {
  //       if (typeof p !== 'string') return Reflect.get(target, p, receiver)
  //       if (Reflect.has(target, p)) return Reflect.get(target, p, receiver)
  //        target.getBuilder()[p]
  //       return target
  //     }
  //   }
  // }

  // getBuilder() {
  //   return this.app.get('db').connection(this.connection).table(this.table)
  // }
}