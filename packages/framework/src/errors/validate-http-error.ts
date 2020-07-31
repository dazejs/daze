/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HttpError } from './http-error';
import { Validate } from '../validate';


export class ValidateHttpError extends HttpError {
  _validate: Validate;
  constructor(message = 'Validation error', validate: Validate) {
    super(422, message, {}, validate && validate.errors);
    this._validate = validate;
    Error.captureStackTrace(this, this.constructor);
  }

  get validate() {
    return this._validate;
  }

  getValidate() {
    return this._validate;
  }

  get errors() {
    return this._validate.getErrors();
  }

  getErrors() {
    return this._validate.getErrors();
  }
}
