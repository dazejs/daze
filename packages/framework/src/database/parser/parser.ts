
import { Builder } from '../builder'
import { Str } from '../../foundation/support/str'

export class Parser {
  components: string[] = [
    'aggregate',
    'columns',
    'from',
    'joins',
    'wheres',
    'groups',
    'havings',
    'orders',
    'limit',
    'offset',
    'lock',
  ];

  /**
   * parse select query builkder
   * @param builder 
   */
  parseSelect(builder: Builder) {
    const sqls = this.parseComponents(builder)
    console.log(sqls.filter(sql => !!sql).join(' '))
  }

  /**
   * parser query components
   * @param builder 
   */
  parseComponents(builder: Builder): string[] {
    const sqls = [];
    for (const component of this.components) {
      if (Reflect.has(builder, `_${component}`)) {
        const method = `parse${Str.upperCamelCase(component)}` as keyof Parser
        if (typeof this[method] === 'function') {
          sqls.push(
            (this[method] as Function)(builder)
          )
        }
      }
    }
    return sqls;
  }

  /**
   * parse aggregate function
   * @param builder 
   */
  parseAggregate(builder: Builder) {
    let { column } = builder._aggregate
    // 需要去重
    if (builder._distinct === true && column !== '*') {
      column = `distinct ${column}`
    } else if (Array.isArray(builder._distinct)) {
      column = `distinct ${this.columnDelimite(builder._distinct)}`
    }
    return `select ${builder._aggregate.func}(${column}) as aggregate`
  }

  /**
   * parse Columns
   * @param builder 
   */
  parseColumns(builder: Builder) {
    if (builder._aggregate) return ''
    const select = builder._distinct ? 'select distinct' : 'select'
    if (!builder._columns.length) return `${select} *`
    return `${select} ${this.columnDelimite(builder._columns)}`
  }

  /**
   * parse table target
   * @param builder 
   */
  parseFrom(builder: Builder) {
    return `from ${builder._from}`
  }

  /**
   * parse where
   * @param builder 
   */
  parseWheres(builder: Builder, conjunction: string = 'where') {
    if (!builder._wheres) return ''
    const wheres = []
    for (const where of builder._wheres) {
      const leadSymlink = where.symlink ? `${where.symlink} ` : ''
      wheres.push(
        `${leadSymlink}${where.column} ${where.operator} ${where.value}`
      )
    }

    return `${conjunction} ${wheres.join(' ')}`
  }

  /**
   * parse orders
   * @param builder 
   */
  parseOrders(builder: Builder) {
    if (!builder._orders.length) return '';
    const flatOrders = builder._orders.map(order => `${order.column} ${order.direction}`)
    return `order by ${flatOrders.join(', ')}`
  }

  /**
   * parse limit
   * @param builder 
   */
  parseLimit(builder: Builder) {
    return `limit ${builder._limit}`
  }

  /**
   * parse offset
   */
  parseOffset(builder: Builder) {
    return `offset ${builder._offset}`
  }

  /**
   * parse lock
   * @param builder 
   */
  parseLock(builder: Builder) {
    if (typeof builder._lock === 'string') return builder._lock
    return ''
  }

  /**
   * parse joins
   * @param builder 
   */
  parseJoins(builder: Builder) {
    const joins = [];
    for (const join of builder._joins) {
      joins.push(
        `${join.type} join ${join.table} ${this.parseWheres(join.builder, 'on')}`
      )
    }
    return joins.join(' ')
  }

  /**
   * parse having
   * @param builder 
   */
  parseHavings(builder: Builder) {
    const havings = []
    for (const having of builder._havings) {
      const leadSymlink = having.symlink ? `${having.symlink} ` : ''
      havings.push(
        `${leadSymlink}${having.column} ${having.operator} ${having.value}`
      )
    }
    return `having ${havings.join(' ')}`
  }
  
  columnDelimite(columns: string[]) {
    return columns.join(', ')
  }
}