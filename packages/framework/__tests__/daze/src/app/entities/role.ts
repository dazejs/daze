import { BaseEntity, table, autoIncrementPrimaryColumn, column, belongsToMany, entity } from '../../../../../src'; 
import User from './user';


@table('roles')
@entity()
export default class extends BaseEntity {
  @autoIncrementPrimaryColumn()
  id: number;

  @column()
  description: string;

  @belongsToMany(() => User)
  users: User[];
}