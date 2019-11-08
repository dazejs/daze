/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HttpError } from './http-error';


export class ValidateHttpError extends HttpError {
  validate: any;
  constructor(message = 'Validation error', validate: any = null) {
    super(422, message, {}, validate && validate.errors);
    this.validate = validate;
    Error.captureStackTrace(this, this.constructor);
  }
}
