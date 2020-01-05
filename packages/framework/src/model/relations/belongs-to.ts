// import { Entity } from '../../base/entity';
import { Model } from '../model';
import { HasRelations } from './has-relations.abstract';
import pluralize from 'pluralize';

export class BelongsTo extends HasRelations {
  /**
   * 创建一对多/一对一的对应关联关系
   * @param parent 
   * @param model 
   * @param foreignKey 
   * @param localKey 
   */
  constructor(parent: Model, model: Model, foreignKey?: string, localKey?: string) {
    super();
    this.parent = parent;
    this.model = model;
    this.foreignKey = foreignKey;
    this.localKey = localKey;
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
  async eagerly(resultModel: Model, relation: string) {
    const foreignKey = this.foreignKey ?? this.getDefaultForeignKey();
    const localKey = this.localKey ?? this.getDefaultLocalKey();

    const query = this.model.newModelBuilderInstance();
    const data = await query.where(localKey, '=', resultModel.getAttribute(foreignKey)).first();
    data && resultModel.setRelation(relation, await this.model.resultToModel(data));
  }

  /**
   * 渴求式加载多个模型关联数据
   * @param resultModels 
   * @param relation 
   */
  async eagerlyMap(resultModels: Model[], relation: string) {
    const foreignKey = this.foreignKey ?? this.getDefaultForeignKey();
    const localKey = this.localKey ?? this.getDefaultLocalKey();

    const range = new Set();
    for (const model of resultModels) {
      // 获取关联外键列表
      const id = model.getAttribute(foreignKey);
      if (id) {
        range.add(id);
      }
    }

    if (range.size > 0) {
      const query = this.model.newModelBuilderInstance();
      const records: Record<string, any>[] = await query.whereIn(localKey, [...range]).find();
      const map = new Map();

      for (const record of records) {
        const pk = record[localKey];
        map.set(pk, record);
      }

      for (const model of resultModels) {
        const items = map.get(model.getAttribute(foreignKey));
        items && model.setRelation(relation, await this.model.resultToModel(items, true));
      }
    }
  }
}