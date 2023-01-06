import { Entity, BaseEntity, AutoIncrementPrimaryColumn, Column, CreateTimestampColumn, UpdateTimestampColumn } from '../../../packages/framework/dist';

@Entity('packages')
export class ExampleEntity extends BaseEntity {
  @AutoIncrementPrimaryColumn()
    id: number;

  @Column()
    author: string;

  @Column()
    name: string;

  @Column()
    description: string;

  @CreateTimestampColumn('datetime')
    created_at: number;

  @UpdateTimestampColumn('datetime')
    updated_at: number;
}