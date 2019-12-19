import { HasOne } from './FUTURE_relations/has-one';

export type RelationTypes = 'hasOne' | 'belongsTo'

const relationsMap: Map<RelationTypes, any> = new Map([
  ['hasOne', HasOne]
]);

export class Relationship<TEntity> {
  relations: Map<string, any>;

  withs: any[] = [];

  with(...relations: string[]) {
    for (const relation of relations) {
      // 存在关联关系
      if (this.relations.has(relation)) {
        this.withs.push(relation);
      }
    }
    return this;
  }
}