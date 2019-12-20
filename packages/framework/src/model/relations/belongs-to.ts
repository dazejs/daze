import { HasRelations } from './has-relations.abstract';

export class BelongsTo<TEntity> extends HasRelations<TEntity> {

  /**
   * 预载入
   */
  eagerly() {
    //
  }
}