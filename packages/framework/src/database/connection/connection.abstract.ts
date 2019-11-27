import { Builder } from '../builder';
import { Parser } from '../parser/parser';

export abstract class AbstractConnection {
  /**
   * sql parser
   */
  parser: Parser;

  /**
   * Create Connection
   */
  constructor() {
    this.parser = this.getDefaultParser();
  }

  /**
   * get default sql parser
   */
  getDefaultParser() {
    return new Parser();
  }

  /**
   * create new Builder instance
   */
  newBuilderInsatnce() {
    return new Builder(this);
  }

  /**
   * set builder from and return builder
   * @param table 
   * @param as 
   */
  table(table: string, as?: string): Builder {
    return this.newBuilderInsatnce().table(table, as);
  }
  
  abstract select(query: string, bindings?: any[]): Promise<any[]>
  abstract insert(query: string, bindings?: any[]):  Promise<number>
  abstract update(query: string, bindings?: any[]):  Promise<number>
  abstract delete(query: string, bindings?: any[]):  Promise<number>
  abstract query(query: string, bindings?: any[]):  Promise<any>
}