import { HasRelations } from './has-relations.abstract';
import { Entity } from '../../base/entity';

export class BelongsTo<TEntity extends Entity> extends HasRelations<TEntity> {

  /**
   * 预载入
   */
  eagerly() {
    //
  }

  eagerlyMap() {
    //
  }
}