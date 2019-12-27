import { Builder, TJoinType, TSymlink } from './builder';

export class NJoin {
  builder: Builder;

  type: TJoinType;

  [key: string]: any;

  constructor(builder: Builder, type: TJoinType) {
    this.builder = builder;
    this.joinType = type;

    return new Proxy(this, this.proxy);
  }

  get proxy(): ProxyHandler<this> {
    return {
      get(target, p, receiver) {
        if (typeof p !== 'string') return Reflect.get(target, p, receiver);
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p, receiver);
        }
        return target.builder[p as keyof Builder];
      }
    };
  }
  /**
   * set join table
   * @param table 
   * @param as 
   */
  table(table: string, as?: string) {
    this.builder.table(table, as);
    return this;
  }

  /**
   * set on sql
   * @param column 
   * @param operator 
   * @param seed 
   * @param symlink 
   */
  on(column: string, operator: string, seed?: string, symlink: TSymlink = 'and') {
    this.builder.whereColumn(column, operator, seed, symlink);
    return this;
  }
}

export type Join = NJoin & Builder;
export const Join: new (builder: Builder, type: TJoinType) => Join = NJoin as any;