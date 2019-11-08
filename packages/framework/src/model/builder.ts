import { Builder } from '../database/builder';


export class ModelBuilder {

  builder: Builder;

  constructor(builder: Builder) {
    this.builder = builder;
  }
}