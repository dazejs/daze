import { Model } from '../model';
import { Application } from '../../foundation/application';
import { Container } from '../../container';
import { Repository } from '../repository';

export abstract class HasRelations {
  /**
   * application
   */
  protected app: Application = Container.get('app')

  /**
   * 父模型
   */
  protected parent: Model;

  /**
   * 当前关联模型
   */
  protected model: Model;

  /**
   * 外键
   */
  protected foreignKey: string;

  /**
   * 关联主键
   */
  protected localKey: string;

  /**
   * 渴求式加载单个模型关联数据
   * @param result 
   * @param relation 
   */
  abstract eagerly(result: Repository, relation: string): Promise<void>
  /**
   * 渴求式加载多个模型关联数据
   * @param results 
   * @param relation 
   */
  abstract eagerlyMap(results: Repository[], relation: string): Promise<void>
}