import pluralize from 'pluralize';
import { Builder } from '../../database/builder';
import { ModelBuilder } from '../builder';
import { Model } from '../model';
import { Repository } from '../repository';
import { HasRelations } from './has-relations.abstract';

/**
 * 一对一关联关系
 */
export class HasOne extends HasRelations {
  /**
     * 创建一对一关联关系
     * @param parent
     * @param model
     * @param foreignKey
     * @param localKey
     */
  constructor(parent: Model<any>, model: Model, foreignKey?: string, localKey?: string) {
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
  async eagerly(resultRepos: Repository, relation: string, queryCallback?: (query: ModelBuilder<any> & Builder) => void) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const model = this.model.createRepository();
    const [currentRelation, ...restRelation] = relation.split('.');
    if (restRelation.length) {
      model.with(restRelation.join('.'));
    }
    const query = model.createQueryBuilder();
    if (queryCallback) queryCallback(query);
    const record = await query
      .getBuilder()
      .where(foreignKey, '=', resultRepos.getAttribute(localKey))
      .first();
    if (record) {
      const repos = await this.model.resultToRepository(model, record);
      resultRepos.setAttribute(currentRelation, repos);
    }
  }

  /**
     * 预载入模型集合
     * @param results
     * @param relation
     */
  async eagerlyMap(resultReposes: Repository[], relation: string, queryCallback?: (query: ModelBuilder<any> & Builder) => void) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const range = new Set();
    for (const repos of resultReposes) {
      const id = repos.getAttribute(localKey);
      id && range.add(id);
    }

    if (range.size > 0) {
      const model = this.model.createRepository();
      const [currentRelation, ...restRelation] = relation.split('.');
      if (restRelation.length) {
        model.with(restRelation.join('.'));
      }
      const query = model.createQueryBuilder();
      if (queryCallback) queryCallback(query);
      const records: Record<string, any>[] = await query
        .getBuilder()
        .whereIn(foreignKey, [...range])
        .find();
      const map = new Map();
      for (const record of records) {
        map.set(record[foreignKey], record);
      }

      for (const item of resultReposes) {
        const record = map.get(item.getAttribute(localKey));
        if (record) {
          item.setAttribute(
            currentRelation,
            await this.model.resultToRepository(model, record, true)
          );
        }
      }
    }
  }
}