import { BaseEntity, AutoIncrementPrimaryColumn, Column, BelongsTo, Entity } from '../../../../../src';
import User from './user';

@Entity('profiles')
export default class extends BaseEntity {
  @AutoIncrementPrimaryColumn()
    id: number;

  @Column()
    user_id: number;

  @Column()
    motto: string;

  @BelongsTo(() => User)
    user: User;
}