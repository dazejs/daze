
import { Parser } from '../parser'
import { IllegalArgumentError } from '../../errors/illegal-argument-error';
import { AbstractConnection } from '../connection/connection.abstract'
import { Join } from './join'

export type TSymlink = 'and' | 'or' | ''

export type TJoinType = 'inner' | 'left' | 'right' | 'cross'

interface IWhereDescribeOption {
  type: 'value' | 'column',
  column: string,
  operator: string,
  value: any,
  symlink: TSymlink
}

interface IHavingDescribeOption {
  type: 'value',
  column: string,
  operator: string,
  value: any,
  symlink: TSymlink
}

interface IAggregateOption {
  func: string,
  column: string,
}

interface IOrderOption {
  column: string,
  direction: string,
}

export class Builder {

  /**
   * The distinct
   */
  _distinct: boolean | string[] = false;

  /**
   * The aggregate desc
   */
  _aggregate: IAggregateOption;

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
  _wheres: IWhereDescribeOption[] = [];

  /**
   * The orders
   */
  _orders: IOrderOption[] = [];

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
  _havings: IHavingDescribeOption[] = []

  /**
   * grammar parser instance
   */
  parser: Parser;

  collection: AbstractConnection;

  constructor(collection: AbstractConnection) {
    this.collection = collection;
    this.parser = this.collection.parser
  }

  field(...columns: (string | string[])[]) {
    for (const column of columns) {
      if (typeof column === 'string') {
        this._columns.push(column)
      } else if (Array.isArray(column)) {
        this._columns.push(...column)
      }
    }
    return this
  }

  /**
   * Set the table target
   * @param table 
   * @param as 
   */
  from(table: string, as?: string) {
    this._from = as ? `${table} as ${as}` : table;
    return this
  }

  where(column: string, operator: any, value?: any, symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'value';
    if (value !== undefined) {
      this._wheres.push({ type, column, operator, value, symlink: _symlink })
    } else {
      this._wheres.push({ type, column, operator: '=', value: operator, symlink: _symlink })
    }
    return this
  }

  whereColumn(column: string, operator: string, value?: string, symlink: TSymlink = 'and') {
    const _symlink = this._wheres.length > 0 ? symlink : '';
    const type = 'column'
    if (value !== undefined) {
      this._wheres.push({ type, column, operator, value, symlink: _symlink })
    } else {
      this._wheres.push({ type, column, operator: '=', value: operator, symlink: _symlink })
    }
    return this
  }

  /**
   * 聚合函数- count
   * @param column 
   */
  count(column = '*') {
    this._aggregate = {
      func: 'count',
      column,
    }
    return this
  }

  /**
   * 聚合函数 - max
   * @param column 
   */
  max(column: string) {
    this._aggregate = {
      func: 'max',
      column,
    }
    return this
  }

  /**
   * 聚合函数 - min
   * @param column 
   */
  min(column: string) {
    this._aggregate = {
      func: 'min',
      column,
    }
    return this
  }

  /**
   * 聚合函数 - sum
   * @param column 
   */
  sum(column: string) {
    this._aggregate = {
      func: 'sum',
      column,
    }
    return this
  }

  /**
   * order by
   * @param column 
   * @param direction 
   */
  orderBy(column: string, direction = 'asc') {
    const _direction = direction.toLowerCase()
    if (!['asc', 'desc'].includes(_direction)) throw new IllegalArgumentError('Order direction must be "asc" or "desc"')
    this._orders.push({
      column,
      direction: _direction,
    })
    return this
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
    return this.limit(value)
  }

  /**
   * offset
   * @param value 
   */
  offset(value: number) {
    this._offset = value >= 0 ? value : 0;
    return this
  }

  /**
   * offset 别名
   * @param value 
   */
  skip(value: number) {
    return this.offset(value)
  }

  /**
   * 去重
   * @param column 
   * @param columns 
   */
  distinct(column?: string | boolean, ...columns: string[]) {
    if (typeof column === 'boolean') {
      this._distinct = column
      return this
    }
    if (columns.length > 0) {
      this._distinct = columns
      return this
    }
    this._distinct = true
    return this
  }

  /**
   * Lock the selected rows
   * @param value 
   */
  lock(value: boolean | string = true) {
    this._lock = value
    return this
  }

  /**
   * Share lock the selected rows
   */
  sharedLock() {
    return this.lock(false)
  }
  
  /**
   * Lock the selected rows for updating
   */
  lockForUpdate() {
    return this.lock(true)
  }

  /**
   * Add group by statement
   * @param columns 
   */
  groupBy(...columns: string[] | string[][]) {
    for (const column of columns) {
      if (typeof column === 'string') {
        this._groups.push(column)
      } else if (Array.isArray(column)) {
        this._groups.push(...column)
      }
    }
    return this
  }

  /**
   * join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   * @param type 
   */
  join(table: string, column: string | ((join: Join) => Join | void), operator?: any, value?: any, type: TJoinType = 'inner') {
    const join = new Join(new Builder(this.collection), table, type)
    if (typeof column === 'string') {
      this._joins.push(
        join.on(column, operator, value)
      )
    } else if (typeof column === 'function') {
      column(join)
      this._joins.push(join)
    }
    return this
  }

  /**
   * left join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   */
  leftJoin(table: string, column: string | ((join: Join) => Join | void), operator?: any, value?: any) {
    return this.join(table, column, operator, value, 'left')
  }

  /**
   * right join
   * @param table 
   * @param column 
   * @param operator 
   * @param value 
   */
  rightJoin(table: string, column: string | ((join: Join) => Join | void), operator?: any, value?: any) {
    return this.join(table, column, operator, value, 'right')
  }

  having(column: string, operator: any, value?: any, symlink: TSymlink = 'and') {
    const _symlink = this._havings.length > 0 ? symlink : '';
    const type = 'value';
    if (value !== undefined) {
      this._havings.push({ type, column, operator, value, symlink: _symlink })
    } else {
      this._havings.push({ type, column, operator: '=', value: operator, symlink: _symlink })
    }
    return this
  }

  toSql() {
    this.parser.parseSelect(this)
  }

}