
import { Parser } from '../parser';
import { IllegalArgumentError } from '../../errors/illegal-argument-error';
import { AbstractConnection } from '../connection/connection.abstract';
import { Join } from './join';

export type TSymlink = 'and' | 'or' | ''

export type TJoinType = 'inner' | 'left' | 'right' | 'cross'

interface WhereDescribeOption {
  type: 'value' | 'column' | 'sql';
  column?: string;
  operator?: string;
  value: any;
  symlink: TSymlink;
}

interface HavingDescribeOption {
  type: 'value';
  column: string;
  operator: string;
  value: any;
  symlink: TSymlink;
}

interface AggregateOption {
  func: string;
  column: string;
}

interface UnionOption {
  builder: Builder;
  isAll: boolean;
}

interface OrderOption {
  column: string;
  direction: string;
}

export class Builder {

  /**
   * The distinct
   */
  _distinct: boolean | string[] = false;

  /**
   * The aggregate desc
   */
  _aggregate?: AggregateOption;

  /**
   * The columns
   */
  _columns: string[] = [];
  
  /**
   * The table target
   */
  _from: string;

  /**
   * The where constraints
   */
  _wheres: WhereDescribeOption[] = [];

  /**
   * The orders
   */
  _orders: OrderOption[] = [];

  /**
   * The maximum number of records
   */
  _limit: number;

  /**
   * The number of records to skip
   */
  _offset: number;

  /**
   * The lock
   */
  _lock: boolean | string;

  /**
   * The groups for group by
   */
  _groups: string[] = [];

  /**
   * The joins
   */
  _joins: Join[] = [];

  /**
   * The Having
   */
  _havings: HavingDescribeOption[] = []

  /**
   * The unions
   */
  _unions: UnionOption[] = [];

  /**
   * binding params
   */
  params: any[] = [];

  /**
   * grammar parser instance
   */
  parser: Parser;

  /**
   * connection instance
   */
  collection: AbstractConnection;

  /**
   * Create Builder instance
   * @param collection 
   */
  constructor(collection: AbstractConnection) {
    this.collection = collection;
    this.parser = this.collection.parser;
  }

  /**
   * Remove aggregate func
   */
  removeAggregate() {
    this._aggregate = undefined;
    return this;
  }
  
  /**
   * show columns
   * @param columns 
   */
  columns(...columns: (string | string[])[]) {
    for (const column of columns) {
      if (typeof column === 'string') {
        this._columns.push(column);
      } else if (Array.isArray(column)) {
        this._columns.push(...column);
      }
    }
    return this;
  }

  /**
   * alias colums
   * @param columns 
   */
  fields(...columns: (string | string[])[]) {
    return this.columns(...columns);
  }

  /**
   * Set the table target
   * @param table 
   * @param as 
   */
  table(table: string, as?: string) {
    this._from = as ? `${table} as ${as}` : table;
    return this;
  }

  /**
   * where
   * @param column 
   * @param operator 
   * @param value 
   * @param symlink 
   */
  where(column: string, operator: any, value?: any, symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'value';
    if (value !== undefined) {
      this._wheres.push({ type, column, operator, value, symlink: _symlink });
      this.addParams(value);
    } else {
      this._wheres.push({ type, column, operator: '=', value: operator, symlink: _symlink });
      this.addParams(operator);
    }
    return this;
  }

  /**
   * where use or tymlink
   * @param column 
   * @param operator 
   * @param value 
   */
  orWhere(column: string, operator: any, value?: any) {
    return this.where(column, operator, value, 'or');
  }

  /**
   * raw where
   * @param sql 
   * @param params 
   * @param symlink 
   */
  whereRaw(sql: string, params: any[] = [], symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'sql';
    this._wheres.push({ type, value: sql, symlink: _symlink});
    this.addParams(params);
    return this;
  }

  /**
   * or raw where
   * @param sql 
   * @param params 
   */
  orWhereRaw(sql: string, params: any[] = []) {
    return this.whereRaw(sql, params, 'or');
  }

  /**
   * where for column
   * @param column 
   * @param operator 
   * @param value 
   * @param symlink 
   */
  whereColumn(column: string, operator: string, value?: string, symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'column';
    if (value !== undefined) {
      this._wheres.push({ type, column, operator, value, symlink: _symlink });
    } else {
      this._wheres.push({ type, column, operator: '=', value: operator, symlink: _symlink });
    }
    return this;
  }

  /**
   * or where column
   * @param column 
   * @param operator 
   * @param value 
   */
  orWhereColumn(column: string, operator: string, value?: string) {
    return this.whereColumn(column, operator, value, 'or');
  }

  /**
   * 聚合函数- count
   * @param column 
   */
  count(column = '*') {
    this._aggregate = {
      func: 'count',
      column,
    };
    return this;
  }

  /**
   * 聚合函数 - max
   * @param column 
   */
  max(column: string) {
    this._aggregate = {
      func: 'max',
      column,
    };
    return this;
  }

  /**
   * 聚合函数 - min
   * @param column 
   */
  min(column: string) {
    this._aggregate = {
      func: 'min',
      column,
    };
    return this;
  }

  /**
   * 聚合函数 - sum
   * @param column 
   */
  sum(column: string) {
    this._aggregate = {
      func: 'sum',
      column,
    };
    return this;
  }

  /**
   * order by
   * @param column 
   * @param direction 
   */
  orderBy(column: string, direction = 'asc') {
    const _direction = direction.toLowerCase();
    if (!['asc', 'desc'].includes(_direction)) throw new IllegalArgumentError('Order direction must be "asc" or "desc"');
    this._orders.push({
      column,
      direction: _direction,
    });
    return this;
  }

  /**
   * limit
   * @param value 
   */
  limit(value: number) {
    if (value >= 0) this._limit = value;
    return this;
  }

  /**
   * limit 别名
   * @param value 
   */
  take(value: number) {
    return this.limit(value);
  }

  /**
   * offset
   * @param value 
   */
  offset(value: number) {
    this._offset = value >= 0 ? value : 0;
    return this;
  }

  /**
   * offset 别名
   * @param value 
   */
  skip(value: number) {
    return this.offset(value);
  }

  /**
   * 去重
   * @param column 
   * @param columns 
   */
  distinct(column: string | boolean = false, ...columns: string[]) {
    if (typeof column === 'boolean') {
      this._distinct = column;
      return this;
    }
    if (columns.length > 0) {
      this._distinct = [column, ...columns];
      return this;
    }
    this._distinct = true;
    return this;
  }

  /**
   * Lock the selected rows
   * @param value 
   */
  lock(value: boolean | string) {
    this._lock = value;
    return this;
  }

  /**
   * Share lock the selected rows
   */
  sharedLock() {
    return this.lock(false);
  }
  
  /**
   * Lock the selected rows for updating
   */
  lockForUpdate() {
    return this.lock(true);
  }

  /**
   * Add group by statement
   * @param columns 
   */
  groupBy(...columns: string[] | string[][]) {
    for (const column of columns) {
      if (typeof column === 'string') {
        this._groups.push(column);
      } else if (Array.isArray(column)) {
        this._groups.push(...column);
      }
    }
    return this;
  }

  /**
   * join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   * @param type 
   */
  join(table: string | ((join: Join & Builder) => Join | void), column?: string, operator?: any, value?: any, type: TJoinType = 'inner') {
    const join = new Join(new Builder(this.collection), type) as Join & Builder;
    if (typeof table === 'string' && column) {
      this._joins.push(
        join.table(table).on(column, operator, value)
      );
      this.addParams(join.getParams());
    } else if (typeof table === 'function') {
      table(join);
      this._joins.push(join);
      this.addParams(join.getParams());
    }
    return this;
  }

  /**
   * left join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   */
  leftJoin(table: string | ((join: Join & Builder) => Join | void), column?: string, operator?: any, value?: any) {
    return this.join(table, column, operator, value, 'left');
  }

  /**
   * right join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   */
  rightJoin(table: string | ((join: Join & Builder) => Join | void), column?: string, operator?: any, value?: any) {
    return this.join(table, column, operator, value, 'right');
  }

  /**
   * having
   * @param column 
   * @param operator 
   * @param value 
   * @param symlink 
   */
  having(column: string, operator: any, value?: any, symlink: TSymlink = 'and') {
    const _symlink = this._havings.length > 0 ? symlink : '';
    const type = 'value';
    if (value !== undefined) {
      this._havings.push({ type, column, operator, value, symlink: _symlink });
    } else {
      this._havings.push({ type, column, operator: '=', value: operator, symlink: _symlink });
    }
    return this;
  }

  /**
   * union
   * @param builder 
   * @param isAll 
   */
  union(builder: Builder | ((union: Builder) => Builder | void), isAll = false) {
    let _builder = builder as Builder;
    if (typeof builder === 'function') {
      _builder = new Builder(this.collection);
      builder(
        _builder
      );
    }
    this._unions.push({
      builder: _builder,
      isAll,
    });
    this.addParams(_builder.getParams());
    return this;
  }

  /**
   * union all
   * @param builder 
   */
  unionAll(builder: Builder | ((union: Builder) => Builder)) {
    return this.union(builder, true);
  }

  /**
   * add param to params
   * @param value 
   */
  addParams(value: any) {
    if (Array.isArray(value)) {
      this.params.push(...value);
      return this;
    }
    this.params.push(value);
    return this;
  }

  /**
   * get all params
   */
  getParams() {
    return this.params;
  }

  /**
   * gen sql string
   */
  toSql() {
    return this.parser.parseSelect(this);
  }

  /**
   * load sql and params
   */
  logSql() {
    console.log('sql:', this.toSql());
    console.log('params:', this.getParams());
    return this;
  }

  /**
   * query multiple records from database,
   */
  async find() {
    const sql = this.toSql();
    const params = this.getParams();
    const results = await this.collection.select(sql, params);
    return results;
  }

  // /**
  //  * query one record from database
  //  * @param id 
  //  */
  // async get(id: string) {
  //   const sql = this.where('id', id).take(1).toSql()
  //   const params = this.getParams()
  //   const results = await this.collection.select(sql, params)
  //   return results[0]
  // }

  /**
   * query first record from database
   */
  async first() {
    const sql = this.take(1).toSql();
    const params = this.getParams();
    const results = await this.collection.select(sql, params);
    return results[0];
  }

  /**
   * query last record from database width id desc
   * @param order 
   */
  async last(order = 'id') {
    const sql = this.take(1).orderBy(order, 'desc').toSql();
    const params = this.getParams();
    const results = await this.collection.select(sql, params);
    return results[0];
  }
}