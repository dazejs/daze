/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { HttpError } from './http-error'


export class NotFoundHttpError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
    Error.captureStackTrace(this, this.constructor);
  }
}
