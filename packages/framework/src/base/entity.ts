import { componentType } from '../decorators/component-type';
import { Model } from '../orm/model';
import { Repository } from '../orm/repository';
import { ModelBuilder } from '../orm/builder';
import { Builder } from '../database/builder';

@componentType('entity')
@Reflect.metadata('connection', 'default')
export class BaseEntity {
  /**
   * 根据主键获取单挑记录
   * @param id 
   */
  async get(id: number | string): Promise<Repository<this> & this> {
    return (new Model(this.constructor as any)).createRepository().get(id) as any;
  }

  /**
   * 创建模型的查询构建器
   */
  createQueryBuilder(): ModelBuilder<this> & Builder {
    return (new Model(this.constructor as any)).createRepository().createQueryBuilder() as any;
  }

  /**
   * 关联预加载
   * @param relations 
   */
  with(relation: string, callback?: (query: Builder) => void): Repository<this> & this {
    return (new Model(this.constructor as any)).createRepository().with(relation, callback) as any;
  }

  /**
   * 自动保存/新建记录
   */
  async save() {
    const repos = (new Model(this.constructor as any)).createRepository();
    repos.fill(this);
    await repos.save();
    Object.assign(this, repos.getAttributes());
    return repos;
  }

  /**
   * 创建记录
   * @param attributes 
   */
  async create(attributes: Record<string, any>): Promise<Repository<this> & this> {
    const repos = (new Model(this.constructor as any)).createRepository();
    return repos.create(attributes) as any;
  }

  /**
   * 根据主键 id 删除记录
   * @param ids
   */
  async destroy(...ids: (number | string)[]) {
    const repos = (new Model(this.constructor as any)).createRepository();
    return repos.destroy(...ids);
  }
}