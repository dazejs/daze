/**
 * Copyright (c) 2018 Chan Zewail
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * patch code methods
 *
 * SUCCESS
 *
 * 100 Continue
 * 101 SwitchingProtocols
 * 102 Processing
 * 103 EarlyHints
 * 200 OK
 * 201 Created
 * 202 Accepted
 * 203 NonAuthoritativeInformation
 * 204 NoContent
 * 205 ResetContent
 * 206 PartialContent
 * 207 MultiStatus
 * 208 AlreadyReported
 * 226 IMUsed
 * 300 MultipleChoices
 * 301 MovedPermanently
 * 302 Found
 * 303 SeeOther
 * 304 NotModified
 * 305 UseProxy
 * 306 Unused
 * 307 TemporaryRedirect
 * 308 PermanentRedirect
 *
 * ERROR
 *
 * 400 BadRequest
 * 401 Unauthorized
 * 402 PaymentRequired
 * 403 Forbidden
 * 404 NotFound
 * 405 MethodNotAllowed
 * 406 NotAcceptable
 * 407 ProxyAuthenticationRequired
 * 408 RequestTimeout
 * 409 Conflict
 * 410 Gone
 * 411 LengthRequired
 * 412 PreconditionFailed
 * 413 PayloadTooLarge
 * 414 URITooLong
 * 415 UnsupportedMediaType
 * 416 RangeNotSatisfiable
 * 417 ExpectationFailed
 * 418 ImATeapot
 * 421 MisdirectedRequest
 * 422 UnprocessableEntity
 * 423 Locked
 * 424 FailedDependency
 * 425 UnorderedCollection
 * 426 UpgradeRequired
 * 428 PreconditionRequired
 * 429 TooManyRequests
 * 431 RequestHeaderFieldsTooLarge
 * 451 UnavailableForLegalReasons
 * 500 InternalServerError
 * 501 NotImplemented
 * 502 BadGateway
 * 503 ServiceUnavailable
 * 504 GatewayTimeout
 * 505 HTTPVersionNotSupported
 * 506 VariantAlsoNegotiates
 * 507 InsufficientStorage
 * 508 LoopDetected
 * 509 BandwidthLimitExceeded
 * 510 NotExtended
 * 511 NetworkAuthenticationRequired
 */


export abstract class Statusable {
  abstract success(data?: any, code?: number): this
  abstract error(data?: any, code?: number): this

  // AMRK: SUCCESS

  /**
   * 100 - Continue
   * @param data
   */
  Continue(data?: any) {
    return this.success(data || 'Continue', 100);
  }

  /**
   * 100 - Continue
   * @param data
   */
  continue(data?: any) {
    return this.Continue(data);
  }

  /**
   * 101 - SwitchingProtocols
   * @param data
   */
  SwitchingProtocols(data?: any) {
    return this.success(data || 'Switching Protocols', 101);
  }

  /**
   * 101 - SwitchingProtocols
   * @param data
   */
  switchingProtocols(data?: any) {
    return this.SwitchingProtocols(data);
  }

  /**
   * 102 - Processing
   * @param data
   */
  Processing(data?: any) {
    return this.success(data || 'Processing', 102);
  }

  /**
   * 102 - Processing
   * @param data
   */
  processing(data?: any) {
    return this.Processing(data);
  }

  /**
   * 103 - EarlyHints
   * @param data
   */
  EarlyHints(data?: any) {
    return this.success(data || 'Early Hints', 103);
  }

  /**
   * 103 - EarlyHints
   * @param data
   */
  earlyHints(data?: any) {
    return this.EarlyHints(data);
  }

  /**
   * 200 - OK
   * @param data
   */
  OK(data?: any) {
    return this.success(data || 'OK', 200);
  }

  /**
   * 200 - OK
   * @param data
   */
  ok(data?: any) {
    return this.OK(data);
  }

  /**
   * 201 - Created
   * @param data
   */
  Created(data?: any) {
    return this.success(data || 'Created', 201);
  }

  /**
   * 201 - Created
   * @param data
   */
  created(data?: any) {
    return this.Created(data);
  }

  /**
   * 202 - Accepted
   * @param data
   */
  Accepted(data?: any) {
    return this.success(data || 'Accepted', 202);
  }

  /**
   * 202 - Accepted
   * @param data
   */
  accepted(data?: any) {
    return this.Accepted(data);
  }

  /**
   * 203 - Non Authoritative Information
   * @param data
   */
  NonAuthoritativeInformation(data?: any) {
    return this.success(data || 'Non Authoritative Information', 203);
  }

  /**
   * 203 - Non Authoritative Information
   * @param data
   */
  nonAuthoritativeInformation(data?: any) {
    return this.NonAuthoritativeInformation(data);
  }

  /**
   * 204 - No Content
   */
  NoContent() {
    return this.success(null, 204);
  }

  /**
   * 204 - No Content
   */
  noContent() {
    return this.NoContent();
  }

  /**
   * 205 - Reset Content
   * @param data
   */
  ResetContent(data?: any) {
    return this.success(data || 'Reset Content', 205);
  }

  /**
   * 205 - Reset Content
   * @param data
   */
  resetContent(data?: any) {
    return this.ResetContent(data);
  }

  /**
   * 206 - Partial Content
   * @param data
   */
  PartialContent(data?: any) {
    return this.success(data || 'Partial Content', 206);
  }

  /**
   * 206 - Partial Content
   * @param data
   */
  partialContent(data?: any) {
    return this.PartialContent(data);
  }

  /**
   * 207 - MultiStatus
   * @param data
   */
  MultiStatus(data?: any) {
    return this.success(data || 'Multi Status', 207);
  }

  /**
   * 207 - MultiStatus
   * @param data
   */
  multiStatus(data?: any) {
    return this.MultiStatus(data);
  }

  /**
   * 208 - Already Reported
   * @param data
   */
  AlreadyReported(data?: any) {
    return this.success(data || 'Already Reported', 208);
  }

  /**
   * 208 - Already Reported
   * @param data
   */
  alreadyReported(data?: any) {
    return this.AlreadyReported(data);
  }

  /**
   * 226 - IM Used
   * @param data
   */
  IMUsed(data?: any) {
    return this.success(data || 'IM Used', 226);
  }

  /**
   * 226 - IM Used
   * @param data
   */
  imUsed(data?: any) {
    return this.IMUsed(data);
  }

  /**
   * 300 - Multiple Choices
   * @param data
   */
  MultipleChoices(data?: any) {
    return this.success(data || 'Multiple Choices', 300);
  }

  /**
   * 300 - Multiple Choices
   * @param data
   */
  multipleChoices(data?: any) {
    return this.MultipleChoices(data);
  }

  /**
   * 301 - MovedPermanently
   * @param data
   */
  MovedPermanently(data?: any) {
    return this.success(data || 'Moved Permanently', 301);
  }

  /**
   * 301 - MovedPermanently
   * @param data
   */
  movedPermanently(data?: any) {
    return this.MovedPermanently(data);
  }

  /**
   * 302 - Found
   * @param data
   */
  Found(data?: any) {
    return this.success(data || 'Found', 302);
  }

  /**
   * 302 - Found
   * @param data
   */
  found(data?: any) {
    return this.Found(data);
  }

  /**
   * 303 - See Other
   * @param data
   */
  SeeOther(data?: any) {
    return this.success(data || 'See Other', 303);
  }

  /**
   * 303 - See Other
   * @param data
   */
  seeOther(data?: any) {
    return this.SeeOther(data);
  }

  /**
   * 304 - 'Not Modified
   * @param data
   */
  NotModified(data?: any) {
    return this.success(data || 'Not Modified', 304);
  }

  /**
   * 304 - 'Not Modified
   * @param data
   */
  notModified(data?: any) {
    return this.NotModified(data);
  }

  /**
   * 305 - Use Proxy
   * @param data
   */
  UseProxy(data?: any) {
    return this.success(data || 'Use Proxy', 305);
  }

  /**
   * 305 - Use Proxy
   * @param data
   */
  useProxy(data?: any) {
    return this.UseProxy(data);
  }

  /**
   * 306 - Unused
   * @param data
   */
  Unused(data?: any) {
    return this.success(data || 'Unused', 306);
  }

  /**
   * 306 - Unused
   * @param data
   */
  unused(data?: any) {
    return this.Unused(data);
  }

  /**
   * 307 - Temporary Redirect
   * @param data
   */
  TemporaryRedirect(data?: any) {
    return this.success(data || 'Temporary Redirect', 307);
  }

  /**
   * 307 - Temporary Redirect
   * @param data
   */
  temporaryRedirect(data?: any) {
    return this.TemporaryRedirect(data);
  }

  /**
   * 308 - Permanent Redirect
   * @param data
   */
  PermanentRedirect(data?: any) {
    return this.success(data || 'Permanent Redirect', 308);
  }

  /**
   * 308 - Permanent Redirect
   * @param data
   */
  permanentRedirect(data?: any) {
    return this.PermanentRedirect(data);
  }

  // MARK: ERROR

  /**
   * 400 - Bad Request
   * @param data
   */
  BadRequest(data?: any) {
    return this.error(data || 'Bad Request', 400);
  }

  /**
   * 400 - Bad Request
   * @param data
   */
  badRequest(data?: any) {
    return this.BadRequest(data);
  }

  /**
   * 401 - Unauthorized
   * @param data
   */
  Unauthorized(data?: any) {
    return this.error(data || 'Unauthorized', 401);
  }

  /**
   * 401 - Unauthorized
   * @param data
   */
  unauthorized(data?: any) {
    return this.Unauthorized(data);
  }

  /**
   * 402 - Payment Required
   * @param data
   */
  PaymentRequired(data?: any) {
    return this.error(data || 'Payment Required', 402);
  }

  /**
   * 402 - Payment Required
   * @param data
   */
  paymentRequired(data?: any) {
    return this.PaymentRequired(data);
  }

  /**
   * 403 - Forbidden
   * @param data
   */
  Forbidden(data?: any) {
    return this.error(data || 'Forbidden', 403);
  }

  /**
   * 403 - Forbidden
   * @param data
   */
  forbidden(data?: any) {
    return this.Forbidden(data);
  }

  /**
   * 404 - Not Found
   * @param data
   */
  NotFound(data?: any) {
    return this.error(data || 'Not Found', 404);
  }

  /**
   * 404 - Not Found
   * @param data
   */
  notFound(data?: any) {
    return this.NotFound(data);
  }

  /**
   * 405 - Method Not Allowed
   * @param data
   */
  MethodNotAllowed(data?: any) {
    return this.error(data || 'Method Not Allowed', 405);
  }

  /**
   * 405 - Method Not Allowed
   * @param data
   */
  methodNotAllowed(data?: any) {
    return this.MethodNotAllowed(data);
  }

  /**
   * 406 - Not Acceptable
   * @param data
   */
  NotAcceptable(data?: any) {
    return this.error(data || 'Not Acceptable', 406);
  }

  /**
   * 406 - Not Acceptable
   * @param data
   */
  notAcceptable(data?: any) {
    return this.NotAcceptable(data);
  }

  /**
   * 407 - Proxy Authentication Required
   * @param data
   */
  ProxyAuthenticationRequired(data?: any) {
    return this.error(data || 'Proxy Authentication Required', 407);
  }

  /**
   * 407 - Proxy Authentication Required
   * @param data
   */
  proxyAuthenticationRequired(data?: any) {
    return this.ProxyAuthenticationRequired(data);
  }

  /**
   * 408 -Request Timeout
   * @param data
   */
  RequestTimeout(data?: any) {
    return this.error(data || 'Request Timeout', 408);
  }

  /**
   * 408 -Request Timeout
   * @param data
   */
  requestTimeout(data?: any) {
    return this.RequestTimeout(data);
  }

  /**
   * 409 - Conflict
   * @param data
   */
  Conflict(data?: any) {
    return this.error(data || 'Conflict', 409);
  }

  /**
   * 409 - Conflict
   * @param data
   */
  conflict(data?: any) {
    return this.Conflict(data);
  }

  /**
   * 410 - Gone
   * @param data
   */
  Gone(data?: any) {
    return this.error(data || 'Gone', 410);
  }

  /**
   * 410 - Gone
   * @param data
   */
  gone(data?: any) {
    return this.Gone(data);
  }

  /**
   * 411 - Length Required
   * @param data
   */
  LengthRequired(data?: any) {
    return this.error(data || 'Length Required', 411);
  }

  /**
   * 411 - Length Required
   * @param data
   */
  lengthRequired(data?: any) {
    return this.LengthRequired(data);
  }

  /**
   * 412 - Precondition Failed
   * @param data
   */
  PreconditionFailed(data?: any) {
    return this.error(data || 'Precondition Failed', 412);
  }

  /**
   * 412 - Precondition Failed
   * @param data
   */
  preconditionFailed(data?: any) {
    return this.PreconditionFailed(data);
  }

  /**
   * 413 - Payload TooLarge
   * @param data
   */
  PayloadTooLarge(data?: any) {
    return this.error(data || 'Payload TooLarge', 413);
  }

  /**
   * 413 - Payload TooLarge
   * @param data
   */
  payloadTooLarge(data?: any) {
    return this.PayloadTooLarge(data);
  }

  /**
   * 414 - URI Too Long
   * @param data
   */
  URITooLong(data?: any) {
    return this.error(data || 'URI Too Long', 414);
  }

  /**
   * 414 - URI Too Long
   * @param data
   */
  uriTooLong(data?: any) {
    return this.URITooLong(data);
  }

  /**
   * 415 - Unsupported Media Type
   * @param data
   */
  UnsupportedMediaType(data?: any) {
    return this.error(data || 'Unsupported Media Type', 415);
  }

  /**
   * 415 - Unsupported Media Type
   * @param data
   */
  unsupportedMediaType(data?: any) {
    return this.UnsupportedMediaType(data);
  }

  /**
   * 416 - Range Not Satisfiable
   * @param data
   */
  RangeNotSatisfiable(data?: any) {
    return this.error(data || 'Range Not Satisfiable', 416);
  }

  /**
   * 416 - Range Not Satisfiable
   * @param data
   */
  rangeNotSatisfiable(data?: any) {
    return this.RangeNotSatisfiable(data);
  }

  /**
   * 417 - Expectation Failed
   * @param data
   */
  ExpectationFailed(data?: any) {
    return this.error(data || 'Expectation Failed', 417);
  }

  /**
   * 417 - Expectation Failed
   * @param data
   */
  expectationFailed(data?: any) {
    return this.ExpectationFailed(data);
  }

  /**
   * 418 - Im A Teapot
   * @param data
   */
  ImATeapot(data?: any) {
    return this.error(data || 'Im A Teapot', 418);
  }

  /**
   * 418 - Im A Teapot
   * @param data
   */
  imATeapot(data?: any) {
    return this.ImATeapot(data);
  }

  /**
   * 421 - Misdirected Request
   * @param data
   */
  MisdirectedRequest(data?: any) {
    return this.error(data || 'Misdirected Request', 421);
  }

  /**
   * 421 - Misdirected Request
   * @param data
   */
  misdirectedRequest(data?: any) {
    return this.MisdirectedRequest(data);
  }

  /**
   * 422 - Unprocessable Entity
   * @param data
   */
  UnprocessableEntity(data?: any) {
    return this.error(data || 'Unprocessable Entity', 422);
  }

  /**
   * 422 - Unprocessable Entity
   * @param data
   */
  unprocessableEntity(data?: any) {
    return this.UnprocessableEntity(data);
  }

  /**
   * 423 - Locked
   * @param data
   */
  Locked(data?: any) {
    return this.error(data || 'Locked', 423);
  }

  /**
   * 423 - Locked
   * @param data
   */
  locked(data?: any) {
    return this.Locked(data);
  }

  /**
   * 424 - Failed Dependency
   * @param data
   */
  FailedDependency(data?: any) {
    return this.error(data || 'Failed Dependency', 424);
  }

  /**
   * 424 - Failed Dependency
   * @param data
   */
  failedDependency(data?: any) {
    return this.FailedDependency(data);
  }

  /**
   * 425 - Unordered Collection
   * @param data
   */
  UnorderedCollection(data?: any) {
    return this.error(data || 'Unordered Collection', 425);
  }

  /**
   * 425 - Unordered Collection
   * @param data
   */
  unorderedCollection(data?: any) {
    return this.UnorderedCollection(data);
  }

  /**
   * 426 - Upgrade Required
   * @param data
   */
  UpgradeRequired(data?: any) {
    return this.error(data || 'Upgrade Required', 426);
  }

  /**
   * 426 - Upgrade Required
   * @param data
   */
  upgradeRequired(data?: any) {
    return this.UpgradeRequired(data);
  }

  /**
   * 428 - Precondition Required
   * @param data
   */
  PreconditionRequired(data?: any) {
    return this.error(data || 'Precondition Required', 428);
  }

  /**
   * 428 - Precondition Required
   * @param data
   */
  preconditionRequired(data?: any) {
    return this.PreconditionRequired(data);
  }

  /**
   * 429 - Too Many Requests
   * @param data
   */
  TooManyRequests(data?: any) {
    return this.error(data || 'Too Many Requests', 429);
  }

  /**
   * 429 - Too Many Requests
   * @param data
   */
  tooManyRequests(data?: any) {
    return this.TooManyRequests(data);
  }

  /**
   * 431 - Request Header Fields Too Large
   * @param data
   */
  RequestHeaderFieldsTooLarge(data?: any) {
    return this.error(data || 'Request Header Fields Too Large', 431);
  }

  /**
   * 431 - Request Header Fields Too Large
   * @param data
   */
  requestHeaderFieldsTooLarge(data?: any) {
    return this.RequestHeaderFieldsTooLarge(data);
  }

  /**
   * 451 - Unavailable For Legal Reasons
   * @param data
   */
  UnavailableForLegalReasons(data?: any) {
    return this.error(data || 'Unavailable For Legal Reasons', 451);
  }

  /**
   * 451 - Unavailable For Legal Reasons
   * @param data
   */
  unavailableForLegalReasons(data?: any) {
    return this.UnavailableForLegalReasons(data);
  }

  /**
   * 500 - Internal Server Error
   * @param data
   */
  InternalServerError(data?: any) {
    return this.error(data || 'Internal Server Error', 500);
  }

  /**
   * 500 - Internal Server Error
   * @param data
   */
  internalServerError(data?: any) {
    return this.InternalServerError(data);
  }

  /**
   * 501 - Not Implemented
   * @param data
   */
  NotImplemented(data?: any) {
    return this.error(data || 'Not Implemented', 501);
  }

  /**
   * 501 - Not Implemented
   * @param data
   */
  notImplemented(data?: any) {
    return this.NotImplemented(data);
  }

  /**
   * 502 - Bad Gateway
   * @param data
   */
  BadGateway(data?: any) {
    return this.error(data || 'Bad Gateway', 502);
  }

  /**
   * 502 - Bad Gateway
   * @param data
   */
  badGateway(data?: any) {
    return this.BadGateway(data);
  }

  /**
   * 503 - Service Unavailable
   * @param data
   */
  ServiceUnavailable(data?: any) {
    return this.error(data || 'Service Unavailable', 503);
  }

  /**
   * 503 - Service Unavailable
   * @param data
   */
  serviceUnavailable(data?: any) {
    return this.ServiceUnavailable(data);
  }

  /**
   * 504 - Gateway Timeout
   * @param data
   */
  GatewayTimeout(data?: any) {
    return this.error(data || 'Gateway Timeout', 504);
  }

  /**
   * 504 - Gateway Timeout
   * @param data
   */
  gatewayTimeout(data?: any) {
    return this.GatewayTimeout(data);
  }

  /**
   * 505 - HTTP Version Not Supported
   * @param data
   */
  HTTPVersionNotSupported(data?: any) {
    return this.error(data || 'HTTP Version Not Supported', 505);
  }

  /**
   * 505 - HTTP Version Not Supported
   * @param data
   */
  httpVersionNotSupported(data?: any) {
    return this.HTTPVersionNotSupported(data);
  }

  /**
   * 506 - Variant Also Negotiates
   * @param data
   */
  VariantAlsoNegotiates(data?: any) {
    return this.error(data || 'Variant Also Negotiates', 506);
  }

  /**
   * 506 - Variant Also Negotiates
   * @param data
   */
  variantAlsoNegotiates(data?: any) {
    return this.VariantAlsoNegotiates(data);
  }

  /**
   * 507 - Insufficient Storage
   * @param data
   */
  InsufficientStorage(data?: any) {
    return this.error(data || 'Insufficient Storage', 507);
  }

  /**
   * 507 - Insufficient Storage
   * @param data
   */
  insufficientStorage(data?: any) {
    return this.InsufficientStorage(data);
  }

  /**
   * 508 - Loop Detected
   * @param data
   */
  LoopDetected(data?: any) {
    return this.error(data || 'Loop Detected', 508);
  }

  /**
   * 508 - Loop Detected
   * @param data
   */
  loopDetected(data?: any) {
    return this.LoopDetected(data);
  }

  /**
   * 509 - Bandwidth Limit Exceeded
   * @param data
   */
  BandwidthLimitExceeded(data?: any) {
    return this.error(data || 'Bandwidth Limit Exceeded', 509);
  }

  /**
   * 509 - Bandwidth Limit Exceeded
   * @param data
   */
  bandwidthLimitExceeded(data?: any) {
    return this.BandwidthLimitExceeded(data);
  }

  /**
   * 510 - Not Extended
   * @param data
   */
  NotExtended(data?: any) {
    return this.error(data || 'Not Extended', 510);
  }

  /**
   * 510 - Not Extended
   * @param data
   */
  notExtended(data?: any) {
    return this.NotExtended(data);
  }

  /**
   * 511 - Network Authentication Required
   * @param data
   */
  NetworkAuthenticationRequired(data?: any) {
    return this.error(data || 'Network Authentication Required', 511);
  }

  /**
   * 511 - Network Authentication Required
   * @param data
   */
  networkAuthenticationRequired(data?: any) {
    return this.NetworkAuthenticationRequired(data);
  }
}