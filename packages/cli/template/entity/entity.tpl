import { Table, BaseModel, AutoIncrementPrimaryColumn } from '@tiger/common';

@Table('{{ name | plural | lower }}')
export class {{ name | firstUpperCase }}Entity extends BaseModel {
    @AutoIncrementPrimaryColumn()
    id: number;
}
