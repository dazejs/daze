import { Model } from '../model';
import { Application } from '../../foundation/application';
import { Container } from '../../container';
// import { Entity } from '../../base/entity';
export abstract class HasRelations<TModel> {
  /**
   * application
   */
  protected app: Application = Container.get('app')

  /**
   * 实体
   */
  protected relationModel: Model<TModel>;

  /**
   * 模型
   */
  protected model: Model<TModel>;

  /**
   * 外键名
   */
  protected foreignKey: string;

  /**
   * 关联键名
   */
  protected localKey: string;

  constructor(model: Model<TModel>, foreignKey: string, localKey: string, relationModel: Model<TModel>) {
    this.model = model;
    this.relationModel = relationModel;
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }

  abstract eagerly(result: Model<TModel>, relation: string): any
  abstract eagerlyMap(results: Model<TModel>[], relation: string): any
}