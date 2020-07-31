/**
 * Copyright (c) 2019 zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { componentType } from '../decorators/component-type';
import { Validate } from '../validate';

@componentType('validator')
export abstract class BaseValidator {
  check(data: Record<string, any>) { 
    return new Validate(this.constructor as any).check(data);
  }

  make(data: Record<string, any>) {
    return new Validate(this.constructor as any).make(data);
  }

  static check(data: Record<string, any>) {
    return new Validate(this).check(data);
  }

  static make(data: Record<string, any>) {
    return new Validate(this).make(data);
  }

}

