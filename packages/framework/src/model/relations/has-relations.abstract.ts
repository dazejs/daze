import { Model } from '../model';
import { Application } from '../../foundation/application';
import { Container } from '../../container';

export abstract class HasRelations<TEntity> {
  /**
   * application
   */
  protected app: Application = Container.get('app')

  /**
   * 实体
   */
  protected entity: any;

  /**
   * 模型
   */
  protected model: Model<TEntity>;

  /**
   * 外键名
   */
  protected foreignKey: string;

  /**
   * 关联键名
   */
  protected localKey: string;

  constructor(model: Model<TEntity>, foreignKey: string, localKey: string, entity: any) {
    this.model = model;
    this.entity = entity;
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }

  abstract eagerly(result: Model<TEntity>, relation: string): any
  abstract eagerlyMap(results: Model<TEntity>[], relation: string): any
}