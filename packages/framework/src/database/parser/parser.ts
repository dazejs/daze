
import { Builder } from '../builder'

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
      sqls.push(
        this.parseComponent(builder, component)
      )
    }
    return sqls;
  }

  parseComponent(builder: Builder, part: string) {
    switch(part) {
      case 'aggregate':
        return this.parseAggregate(builder)
      case 'columns':
        return this.parseColumns(builder)
      case 'from':
        return this.parseFrom(builder)
      case 'joins':
        return this.parseJoins(builder)
      case 'wheres':
        return this.parseWheres(builder)
      case 'groups':
        return this.parseGroups(builder)
      case 'havings':
        return this.parseHavings(builder)
      case 'orders':
        return this.parseOrders(builder)
      case 'limit':
        return this.parseLimit(builder)
      case 'offset':
        return this.parseOffset(builder)
      case 'lock':
        return this.parseLock(builder)
      default:
        return ''
    }
  }

  /**
   * parse aggregate function
   * @param builder 
   */
  parseAggregate(builder: Builder) {
    if (!builder._aggregate) return '';
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
    if (builder._aggregate) return '';
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
   * parse groups
   * @param builder 
   */
  parseGroups(builder: Builder) {
    return `group by ${this.columnDelimite(builder._groups)}`
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

  parseunions(builder: Builder) {

  }

  columnDelimite(columns: string[]) {
    return columns.join(', ')
  }
}