import { Entity, table, autoIncrementPrimaryColumn, column } from '../../../../../src';

@table('profiles')
export default class extends Entity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  user_id: number;

  @column()
  motto: string;
}