import { BaseEntity, table, autoIncrementPrimaryColumn, column } from '../../../../../src'; 


@table('roles')
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  description: string;
}