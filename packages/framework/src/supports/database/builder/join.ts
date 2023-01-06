import { Builder, TJoinType, TSymlink } from './builder';

export class NJoin {
  /**
   * sql builder instance
   */
  builder: Builder;

  /**
   * join type
   * 'inner' | 'left' | 'right' | 'cross'
   */
  type: TJoinType;

  /**
   * Create Join Builder
   * @param builder 
   * @param type 
   */
  constructor(builder: Builder, type: TJoinType) {
    this.builder = builder;
    this.type = type;

    return new Proxy(this, this.proxy);
  }

  /**
   * get Join proxy
   */
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
  
  /**
   * set or on sql
   * @param column 
   * @param operator 
   * @param seed 
   */
  orOn(column: string, operator: string, seed?: string) {
    return this.on(column, operator, seed, 'or');
  }
}

export type Join = NJoin & Builder;
export const Join: new (builder: Builder, type: TJoinType) => Join = NJoin as any;