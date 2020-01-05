import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
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
    this.foreignKey = foreignKey;
    this.localKey = localKey;
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
  async eagerly(resultModel: Model, relation: string) {
    const foreignKey = this.foreignKey ?? this.getDefaultForeignKey();
    const localKey = this.localKey ?? this.getDefaultLocalKey();

    const query = this.model.newModelBuilderInstance();
    const records = await query.where(foreignKey, '=', resultModel.getAttribute(localKey)).find();
    records && resultModel.setRelation(relation, await this.model.resultsToModels(records));
  }

  /**
   * 渴求式加载多个模型的关联数据
   * @param resultModels 
   * @param relation 
   */
  async eagerlyMap(resultModels: Model[], relation: string) {
    const foreignKey = this.foreignKey ?? this.getDefaultForeignKey();
    const localKey = this.localKey ?? this.getDefaultLocalKey();

    const range = new Set();
    for (const model of resultModels) {
      // 获取关联外键列表
      const id = model.getAttribute(localKey);
      id && range.add(id);
    }

    if (range.size > 0) {
      const query = this.model.newModelBuilderInstance();
      const records: Record<string, any>[] = await query.whereIn(foreignKey, [...range]).find();
      const map = new Map();
      for (const record of records) {
        const pk = record[foreignKey];
        const items = map.get(pk) || [];
        items.push(record);
        map.set(pk, items);
      }

      for (const model of resultModels) {
        const items = map.get(model.getAttribute(localKey));
        items && model.setRelation(relation, await this.model.resultsToModels(items));
      }
    }
  }
}