import { OutgoingHttpHeaders } from "http";

/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export class HttpError extends Error {
  code: number;

  headers: OutgoingHttpHeaders;

  errors: any[];

  constructor(code = 500, message = '', headers = {}, errors: any[] = []) {
    super(message);
    this.code = code;
    this.headers = headers;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  getErrors() {
    return this.errors;
  }
}