// import { Entity } from '../../base/entity';
import pluralize from 'pluralize';
import { Builder } from '../../database/builder';
import { ModelBuilder } from '../builder';
import { Model } from '../model';
import { Repository } from '../repository';
import { HasRelations } from './has-relations.abstract';

export class BelongsTo extends HasRelations {
  /**
     * 创建一对多/一对一的对应关联关系
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
    return `${pluralize.singular(this.model.getTable())}_${this.model.getPrimaryKey()}`;
  }

  /**
     * 获取默认关联主键名
     */
  getDefaultLocalKey() {
    return this.model.getPrimaryKey();
  }

  /**
     * 渴求式加载单个模型关联数据
     * @param resultModel
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
    const data = await query
      .getBuilder()
      .where(localKey, '=', resultRepos.getAttribute(foreignKey))
      .first();

    if (data) {
      resultRepos.setAttribute(
        currentRelation, 
        await this.model.resultToRepository(model, data)
      );
    }
  }

  /**
     * 渴求式加载多个模型关联数据
     * @param resultModels
     * @param relation
     */
  async eagerlyMap(resultReposes: Repository[], relation: string, queryCallback?: (query: ModelBuilder<any> & Builder) => void) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;

    const range = new Set();
    for (const repos of resultReposes) {
      // 获取关联外键列表
      const id = repos.getAttribute(foreignKey);
      if (id) {
        range.add(id);
      }
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
        .whereIn(localKey, [...range])
        .find();
      const map = new Map();

      for (const record of records) {
        const pk = record[localKey];
        map.set(pk, record);
      }

      for (const repos of resultReposes) {
        const item = map.get(repos.getAttribute(foreignKey));
        if (item) {
          repos.setAttribute(
            currentRelation,
            await this.model.resultToRepository(model, item)
          );
        }
      }
    }
  }
}