import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
import { Repository } from '../repository';
import pluralize from 'pluralize';

export class HasMany extends HasRelations {
  /**
   * 创建一对多关联关系
   * @param parent 
   * @param model 
   * @param foreignKey 
   * @param localKey 
   */
  constructor(parent: Model, model: Model, foreignKey?: string, localKey?: string) {
    super();
    this.parent = parent;
    this.model = model;
    this.foreignKey = foreignKey ?? this.getDefaultForeignKey();
    this.localKey = localKey ?? this.getDefaultLocalKey();
  }

  /**
   * 获取默认外键名
   */
  getDefaultForeignKey() {
    return `${pluralize.singular(this.parent.getTable())}_${this.parent.getPrimaryKey()}`;
  }

  /**
   * 获取默认关联主键
   */
  getDefaultLocalKey() {
    return this.parent.getPrimaryKey();
  }

  /**
   * 渴求式加载单个模型关联数据
   * @param resultModel 
   * @param relation 
   */
  async eagerly(resultRepos: Repository, relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;

    const model = this.model.createRepository();
    const records = await model
      .createQueryBuilder()
      .getBuilder()
      .where(foreignKey, '=', resultRepos.getAttribute(localKey))
      .find();

    if (records) {
      resultRepos.setAttribute(
        relation, 
        await this.model.resultToRepositories(model, records)
      );
    }
  }

  /**
   * 渴求式加载多个模型的关联数据
   * @param resultModels 
   * @param relation 
   */
  async eagerlyMap(resultReposes: Repository[], relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;

    const range = new Set();
    for (const repos of resultReposes) {
      // 获取关联外键列表
      const id = repos.getAttribute(localKey);
      id && range.add(id);
    }

    if (range.size > 0) {
      const model = this.model.createRepository();
      const records: Record<string, any>[] = await model
        .createQueryBuilder()
        .getBuilder()
        .whereIn(foreignKey, [...range])
        .find();
      const map = new Map();
      for (const record of records) {
        const pk = record[foreignKey];
        const items = map.get(pk) || [];
        items.push(record);
        map.set(pk, items);
      }

      for (const repos of resultReposes) {
        const items = map.get(repos.getAttribute(localKey));
        if (items) {
          repos.setAttribute(
            relation,
            await this.model.resultToRepositories(model, records)
          );
        }
      }
    }
  }
}