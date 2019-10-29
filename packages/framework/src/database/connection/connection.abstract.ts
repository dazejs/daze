import { Parser } from '../parser/parser'
import { Builder } from '../builder'

export abstract class AbstractConnection {
  parser: Parser;

  constructor() {
    this.useDefaultParser()
  }

  useDefaultParser() {
    this.parser = this.getDefaultParser()
  }

  getDefaultParser() {
    return new Parser()
  }

  builder() {
    return new Builder(this)
  }

  table(table: string, as?: string): Builder {
    return this.builder().from(table, as);
  }

  abstract select(query: string, bindings: any[]): Promise<any[]>
  abstract insert(query: string, bindings: any[]):  Promise<number>
  abstract update(query: string, bindings: any[]):  Promise<number>
  abstract delete(query: string, bindings: any[]):  Promise<number>
  abstract query(query: string, bindings: any[]):  Promise<any>
}