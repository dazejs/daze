import { Container } from '../container';
import { Database } from '../database';
import { Builder } from '../database/builder';
import { Application } from '../foundation/application';
import { Model } from './model';
import { Repository } from './repository'; 
import { Paginator, PaginatorOption } from '../pagination';

export class ModelBuilder<TEntity = any> {
  /**
   * Application instance
   */
  private app: Application = Container.get('app');

  /**
   * Database query builder instance
   */
  private builder: Builder;

  /**
   * model instance
   */
  private model: Model<TEntity>;

  /**
   * repository instance
   */
  private repository: Repository;

  /**
   * 不走代理的接口列表
   */
  private throughs: string[] = ['insert', 'update', 'delete', 'aggregate', 'count', 'max', 'min', 'sum', 'avg'];

  /**
   * Create Builder For Model
   * @param model 
   */
  constructor(model: Model<TEntity>, repository: Repository) {
    this.model = model;
    this.repository = repository;
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
        this.model.getConnectionName()
      )
      .table(
        this.model.getTable()
      );
  }

  /**
   * get database builder
   */
  getBuilder() {
    return this.builder;
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
      return this.model.resultToRepositories(this.repository, records);
    }
    const records = await this.builder.whereNull(
      this.model.getSoftDeleteKey()
    ).find();
    return this.model.resultToRepositories(this.repository, records);
  }

  /**
   * 查询数据集和 count
   */
  async findAndCount(): Promise<[(Repository<TEntity> & TEntity)[], number]> {
    if (this.model.isForceDelete()) {
      const [records, count] = await this.builder.findAndCount();
      const results = await this.model.resultToRepositories(this.repository, records);
      return [results, count];
    }
    const [records, count] = await this.builder.whereNull(
      this.model.getSoftDeleteKey()
    ).findAndCount();
    const results = await this.model.resultToRepositories(this.repository, records);
    return [results, count];
  }

  /**
   * 分页查询
   * @param page 
   * @param perPage 
   */
  async pagination(page: number, perPage = 10, option?: PaginatorOption) {
    this.builder.take(perPage).skip((page - 1) * perPage);
    const [items, count] = await this.findAndCount();
    const paginator: Paginator = new Paginator(
      items.map(item => item.getAttributes()),
      count,
      page,
      perPage,
      option
    );
    return paginator;
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
    return this.model.resultToRepository(this.repository, record);
  }
}