/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import assert from 'assert'
import is from 'core-util-is'
import { IllegalArgumentError } from '../errors/illegal-argument-error'

type TStage = (...args: any[]) => any
type TProcesser = (...args: any[]) => any

export class Pipeline {

  stages: TStage[]

  payload: any;

  /**
   * Create Pipeline Instance
   */
  constructor(...stages: TStage[]) {
    /**
     * @type stages pipe stages
     */
    this.stages = stages;
  }

  /**
   * add pipe stage
   */
  pipe(...stages: TStage[]) {
    for (const stage of stages) {
      assert(is.isFunction(stage), new IllegalArgumentError('pipe stage must be function'));
      this.stages.push(stage);
    }
    return this;
  }

  /**
   * send payloads
   */
  send(...payload: any[]) {
    this.payload = payload;
    return this;
  }

  /**
   * run pipeline
   */
  async process(processor: TProcesser) {
    if (this.stages.length > 0) {
      const callback = this.stages
        .reduceRight(
          (next, pipe) => async (...data: any[]) => pipe(...data, next.bind(null, ...data)),
          async (...params: any[]) => processor(...params),
        );
      return callback(...this.payload);
    }
    return processor(...this.payload);
  }
}
