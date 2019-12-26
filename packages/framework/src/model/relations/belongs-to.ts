import { Entity } from '../../base/entity';
import { Model } from '../model';
import { HasRelations } from './has-relations.abstract';

export class BelongsTo<TEntity extends Entity> extends HasRelations<TEntity> {
  /**
   * 预载入
   */
  async eagerly(result: TEntity, relation: string) {
    const foreignKey = this.foreignKey;
    const localKey = this.localKey;
    const entity = this.entity;

    const model = new Model(
      this.app.get(entity) as TEntity
    );

    const query = model.newModelBuilderInstance();
    const data = await query.where(localKey, '=', result.getAttribute(foreignKey)).first();
    result.setRelation(relation, data);
  }

  async eagerlyMap(results: TEntity[], relation: string) {
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
      const model = new Model(
        this.app.get(entity) as TEntity
      );
      const query = model.newModelBuilderInstance();
      const data: Record<string, any>[] = await query.whereIn(localKey, range).find();
      const dataMap = new Map(
        data.map(item => [item.getAttribute(localKey), item])
      );
      for (const item of results) {
        const _data = dataMap.get(item.getAttribute(foreignKey));
        if (_data) {
          item.setRelation(relation, _data);
        }
      }
    }
  }
}