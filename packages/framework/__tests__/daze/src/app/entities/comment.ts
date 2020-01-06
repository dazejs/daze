import { Entity, table, autoIncrementPrimaryColumn, column } from '../../../../../src';

@table('comments')
export default class extends Entity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  user_id: number;

  @column()
  comment: string;
}