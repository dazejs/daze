import { Model } from './model';
import { Entity } from '../base/entity';
import { Application } from '../foundation/application';
import { Container } from '../container';
import { Builder } from '../database/builder';
import { Database } from '../database';

export class ModelBuilder<TEntity extends Entity> {

  /**
   * Application instance
   */
  app: Application = Container.get('app');

  /**
   * Model instance
   */
  model: Model<TEntity>;

  /**
   * Database query builder instance
   */
  builder: Builder;

  /**
   * Create Builder For Model
   * @param model 
   */
  constructor(model: Model<TEntity>) {
    this.model = model;
    this.builder = this.newBuilderInstance();
    // Proxy class
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

  /**
   * 根据模型信息创建查询构造器实例
   * Create a query constructor instance based on model information
   */
  newBuilderInstance() {
    return this.app.get<Database>('db')
      .connection(
        this.model.getConnectioName()
      )
      .table(
        this.model.getTable()
      );
  }

  setModel(model: Model<TEntity>) {
    this.model = model;
    return this;
  }

  getModel() {
    return this.model;
  }

  exportToModel(result: Record<string, any>) {
    // 创建一个已存在记录的模型
    // Create a model of an existing record
    const model = this.model.newModelInstance(result, true) as Model<TEntity> & TEntity;
    return model;
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

  /**
   * 查询预处理
   */
  prepare() {
    this.builder.columns(
      this.model.getColumns()
    );
    return this as this & Builder & TEntity;
  }

  async get(id: number | string) {
    const res = await this.builder.where(
      this.model.getDefaultPrimaryKey(),
      '=',
      id
    ).first();

    return this.exportToModel(res);
  }
}