import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
import { Repository } from '../repository';
import pluralize from 'pluralize';
import { Builder } from '../../database/builder';

export class HasOne extends HasRelations {
  /**
   * 创建一对一关联关系
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
   * 获取默认关联主键名
   */
  getDefaultLocalKey() {
    return this.parent.getPrimaryKey();
  }

  /**
   * 预载入单个实体
   * @param result 
   * @param relation 
   */
  async eagerly(resultRepos: Repository, relation: string, queryCallback?: (query: Builder) => void) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const model = this.model.createRepository();
    const query = model.createQueryBuilder().getBuilder();
    if (queryCallback) queryCallback(query);
    const record = await query.where(foreignKey, '=', resultRepos.getAttribute(localKey))
      .first();
    const repos = await this.model.resultToRepository(model, record);
    if (record) {
      resultRepos.setAttribute(relation, repos);
    }
  }

  /**
   * 预载入模型集合
   * @param results 
   * @param relation 
   */
  async eagerlyMap(resultReposes: Repository[], relation: string, queryCallback?: (query: Builder) => void) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const range = new Set();
    for (const repos of resultReposes) {
      const id = repos.getAttribute(localKey);
      id && range.add(id);
    }

    if (range.size > 0) {
      const model = this.model.createRepository();
      const query = model.createQueryBuilder().getBuilder();
      if (queryCallback) queryCallback(query);
      const records: Record<string, any>[] = await query.whereIn(foreignKey, [...range]).find();
      const map = new Map();
      for (const record of records) {
        map.set(record[foreignKey], record);
      }

      for (const item of resultReposes) {
        const record = map.get(item.getAttribute(localKey));
        if (record) {
          item.setAttribute(
            relation,
            await this.model.resultToRepository(model, record, true)
          );
        }
      }
    }
  }
}