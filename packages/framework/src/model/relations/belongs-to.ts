import { Entity } from '../../base/entity';
import { Model } from '../model';
import { HasRelations } from './has-relations.abstract';

export class BelongsTo<TEntity extends Entity> extends HasRelations<TEntity> {
  /**
   * 预载入
   */
  async eagerly(result: Model<TEntity>, relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;

    const model = this.model.newInstance(
      this.app.get(entity) as TEntity
    );

    const query = model.newModelBuilderInstance();
    const data = await query.where(localKey, '=', result.getAttribute(foreignKey)).first();
    result.setRelation(relation, data);
  }

  async eagerlyMap(results: Model<TEntity>[], relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;

    const range = [];

    for (const item of results) {
      // 获取关联外键列表
      const id = item.getAttribute(foreignKey);
      if (id) {
        range.push(id);
      }
    }

    if (range.length > 0) {
      const model = this.model.newInstance(
        this.app.get(entity) as TEntity
      );
      const query = model.newModelBuilderInstance();

      const data = await query.whereIn(localKey, range).find();

      const dataMap = new Map(
        data.map(item => [item.getAttribute(localKey), item])
      );

      for (const item of results) {
        const _model = dataMap.get(item.getAttribute(foreignKey));
        if (_model) {
          item.setRelation(relation, _model);
        }
      }
    }
  }
}