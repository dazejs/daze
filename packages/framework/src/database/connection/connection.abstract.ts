import { Builder } from '../builder';
import { Parser } from '../parser/parser';
// import { Model } from '../../model/model';
// import { Entity } from '../../base/entity';

export abstract class AbstractConnection {
  parser: Parser;

  // model: Model<Entity>;

  constructor() {
    this.useDefaultParser();
  }

  // setModel(model: Model<Entity>) {
  //   this.model = model;
  //   return this;
  // }

  // getModel() {
  //   return this.model;
  // }

  useDefaultParser() {
    this.parser = this.getDefaultParser();
  }

  getDefaultParser() {
    return new Parser();
  }

  builder() {
    return new Builder(this);
  }

  table(table: string, as?: string): Builder {
    return this.builder().table(table, as);
  }

  abstract select(query: string, bindings: any[]): Promise<any[]>
  abstract insert(query: string, bindings: any[]):  Promise<number>
  abstract update(query: string, bindings: any[]):  Promise<number>
  abstract delete(query: string, bindings: any[]):  Promise<number>
  abstract query(query: string, bindings: any[]):  Promise<any>
}