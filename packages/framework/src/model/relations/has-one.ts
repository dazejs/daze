import { HasRelations } from './has-relations.abstract';
import { Model } from '../model';
import { Entity } from '../../base/entity';

export class HasOne<TEntity extends Entity> extends HasRelations<TEntity> {
  /**
   * 预载入单个模型
   * @param result 
   * @param relation 
   */
  async eagerly(result: Model<TEntity>, relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;
    // const model = new Model(
    //   this.app.get(entity) as TEntity
    // );
    const model = this.model.newInstance(
      this.app.get(entity) as TEntity
    );

    const query = model.newModelBuilderInstance();
    const data = await query.where(foreignKey, '=', result.getAttribute(localKey)).first();
    result.setRelation(relation, data);
  }

  /**
   * 预载入模型集合
   * @param results 
   * @param relation 
   */
  async eagerlyMap(results: Model<TEntity>[], relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;

    const range = [];

    for (const item of results) {
      // 获取关联外键列表
      const id = item.getAttribute(localKey);
      if (id) {
        range.push(id);
      }
    }

    if (range.length > 0) {
      const model = this.model.newInstance(
        this.app.get(entity) as TEntity
      );
      const query = model.newModelBuilderInstance();

      const data = await query.whereIn(foreignKey, range).find();

      const dataMap = new Map(
        data.map(item => [item.getAttribute(foreignKey), item])
      );

      for (const item of results) {
        const _model = dataMap.get(item.getAttribute(localKey));
        if (_model) {
          item.setRelation(relation, _model);
        }
      }
    }
  }
}