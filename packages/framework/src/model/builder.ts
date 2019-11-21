import { Model } from './model';
import { Entity } from '../base/entity';
import { Application } from '../foundation/application';
import { Container } from '../container';
import { Builder } from '../database/builder';
import { Database } from '../database';

export class ModelBuilder<TEntity extends Entity> {

  app: Application = Container.get('app');

  model: Model<TEntity>;

  // model: Model<TEntity>;

  builder: Builder;

  // throughs = new Set(['aggregate', 'count', 'avg', 'max', 'min', 'sum', 'insert', 'first'])

  constructor(entity: TEntity) {
    this.model = new Model(entity);

    this.builder = this.newBuilder();

    return new Proxy(this, this.proxy);
  } 

  get proxy(): ProxyHandler<this> {
    return {
      get(target: ModelBuilder<TEntity>, p: string | number | symbol, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        return target.builder[p as keyof Builder];
      }
    };
  }

  newBuilder() {
    return this.app.get<Database>('db')
      .connection(this.model.connection)
      .table(this.model.table);
  }

  setModel(model: Model<TEntity>) {
    this.model = model;
    return this;
  }

  getModel() {
    return this.model;
  }


  exportToModel(result: Record<string, any>) {
    const res = this.model.newModelInstance(result) as Model<TEntity> & TEntity;
    return res;
  }

  exportToModelCollection(result: Record<string, any>[]) {
    const data = [];
    for (const item of result) {
      data.push(
        this.exportToModel(item)
      );
    }
    return data;
  }

  prepare() {
    this.builder.columns(...this.model.columns);
    return this as this & Builder & TEntity;
  }

  async get(id: number | string) {
    const res = await this.builder.where(this.model.primaryKey, '=', id).first();

    return this.exportToModel(res);
  }
}