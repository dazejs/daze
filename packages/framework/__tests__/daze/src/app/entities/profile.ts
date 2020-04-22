import { BaseEntity, table, autoIncrementPrimaryColumn, column } from '../../../../../src';

@table('profiles')
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  user_id: number;

  @column()
  motto: string;
}