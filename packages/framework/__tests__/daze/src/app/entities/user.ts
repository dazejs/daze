import { Entity, table, autoIncrementPrimaryColumn, column } from '../../../../../src';

@table('users')
export default class extends Entity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  name: string;

  @column()
  age: number;

  @column()
  description: string;
}