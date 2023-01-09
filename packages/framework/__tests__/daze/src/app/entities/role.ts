import { BaseEntity, AutoIncrementPrimaryColumn, Column, BelongsToMany, Entity } from '../../../../../src';
import User from './user';


@Entity('roles')
export default class extends BaseEntity {
  @AutoIncrementPrimaryColumn()
    id: number;

  @Column()
    description: string;

  @BelongsToMany(() => User)
    users: User[];
}