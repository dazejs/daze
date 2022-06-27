import { SourceType } from '../lib/render';

export abstract class TPLActionAbstract {
  protected _source: SourceType;

  abstract resolve(name: string, destination: Record<string, any>): any
  source(_source: SourceType) {
    this._source = _source;
    return this;
  }
}