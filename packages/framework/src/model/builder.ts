import { Model } from './model';
import { Application } from '../foundation/application';
import { Container } from '../container';
import { Builder } from '../database/builder';
import { Database } from '../database';

export class ModelBuilder<M extends Model> {
  /**
   * Application instance
   */
  private app: Application = Container.get('app');

  /**
   * Model instance
   */
  private model: M;

  /**
   * Database query builder instance
   */
  private builder: Builder;

  /**
   * 不走代理的接口列表
   */
  private throughs: string[] = ['insert', 'aggregate', 'count', 'max', 'min', 'sum', 'avg', 'delete']; 

  /**
   * Create Builder For Model
   * @param model 
   */
  constructor(model: M) {
    this.model = model;
    this.builder = this.newBuilderInstance();
    // Proxy class
    return new Proxy(this, this.proxy);
  } 

  /**
   * Model builder proxy
   */
  get proxy(): ProxyHandler<this> {
    return {
      get(target: any, p: string | number | symbol, receiver: any) {
        if (typeof p !== 'string' || Reflect.has(target, p)) return Reflect.get(target, p, receiver);
        if (target.builder && Reflect.has(target.builder, p) && typeof target.builder[p as keyof Builder] === 'function') {
          return target.handleForwardCalls(p as keyof Builder);
        }
        return Reflect.get(target, p, receiver);
      }
    };
  }

  /**
   * handle proxy getter
   * @param p 
   */
  handleForwardCalls(p: keyof Builder) {
    return (...args: any[]) => {
      if (this.throughs.includes(p)) {
        return (this.builder[p] as Function)(...args);
      }
      (this.builder[p] as Function)(...args);
      return new Proxy(this, this.proxy);
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

  /**
   * set new model
   * @param model 
   */
  setModel(model: M) {
    this.model = model;
    return this;
  }

  getBuilder() {
    return this.builder;
  }

  /**
   * get builder model
   */
  getModel() {
    return this.model;
  }

  /**
   * 查询预处理
   */
  prepare() {
    this.builder.columns(
      ...this.model.getColumns().keys()
    );
    return this;
  }

  /**
   * 查询数据集
   */
  async find() {
    if (this.model.isForceDelete()) {
      const records = await this.builder.find();
      return this.model.resultsToModels(records);
    }
    const records = await this.builder.whereNull(
      this.model.getSoftDeleteKey()
    ).find();
    return this.model.resultsToModels(records);
  }

  /**
   * 查询单条记录
   */
  async first() {
    if (!this.model.isForceDelete()) { 
      this.builder.whereNull(
        this.model.getSoftDeleteKey()
      );
    }
    const record = await this.builder.first();
    return this.model.resultToModel(record);
  }
}