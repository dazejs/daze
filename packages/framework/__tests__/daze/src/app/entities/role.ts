import { BaseEntity, table, autoIncrementPrimaryColumn, column, belongsToMany } from '../../../../../src'; 
import User from './user';


@table('roles')
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  description: string;

  @belongsToMany(() => User)
  users: User[];
}