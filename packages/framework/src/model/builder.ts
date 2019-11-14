import { Model } from '../base/model';
import { Application } from '../foundation/application';
import { Container } from '../container';
import { Builder } from '../database/builder';


export class ModelBuilder {

  app: Application = Container.get('app');

  model: Model;

  builder: Builder;

  table: string;

  connection: string;

  columns: string[] = [];

  primaryKey: string;

  constructor(model: Model) {
    this.table = Reflect.getMetadata('table', model.constructor);
    this.connection = Reflect.getMetadata('connection', model.constructor);
    this.columns = Reflect.getMetadata('columns', model.constructor);
    this.primaryKey = Reflect.getMetadata('primaryKey', model.constructor);

    this.setBuilder();

    return new Proxy(this, this.proxy);
  } 


  get proxy(): ProxyHandler<this> {
    return {
      get(target: ModelBuilder, p: string | number | symbol, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        if (Reflect.has(target.builder, p)) {
          
        }
        
        return Reflect.get(target, p, receiver);
      }
    };
  }

  setBuilder() {
    this.builder = this.app.get('db')
      .connection(this.connection)
      .table(this.table); 
  }

  prepare() {
    
    this.builder.columns(...this.columns);

    return this;
  }
}