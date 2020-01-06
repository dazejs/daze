import { Entity, table, autoIncrementPrimaryColumn, column } from '../../../../../src';

@table('roles')
export default class extends Entity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  description: string;
}