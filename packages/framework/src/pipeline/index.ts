/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import assert from 'assert'
import is from 'core-util-is'
import { IllegalArgumentError } from '../errors/illegal-argument-error'

export class Pipeline {
  stages: any[]
  payload: any;
  /**
   * Create Pipeline Instance
   */
  constructor(...stages: any[]) {
    /**
     * @type stages pipe stages
     */
    this.stages = stages;
  }

  /**
   * add pipe stage
   */
  pipe(...stages: any[]) {
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
  async process(processor: any) {
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
