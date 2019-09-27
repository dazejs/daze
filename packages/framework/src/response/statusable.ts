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
  abstract success(data: any, code: number): this

  abstract error(data: any, code: number): this

  // AMRK: SUCCESS

  Continue(data: any) {
    return this.success(data || 'Continue', 100)
  }

  SwitchingProtocols(data: any) {
    return this.success(data || 'Switching Protocols', 101)
  }

  Processing(data: any) {
    return this.success(data || 'Processing', 102)
  }

  EarlyHints(data: any) {
    return this.success(data || 'Early Hints', 103)
  }

  OK(data: any) {
    return this.success(data || 'OK', 200)
  }

  Created(data: any) {
    return this.success(data || 'Created', 201)
  }

  Accepted(data: any) {
    return this.success(data || 'Accepted', 202)
  }

  NonAuthoritativeInformation(data: any) {
    return this.success(data || 'Non Authoritative Information', 203)
  }

  NoContent() {
    return this.success(null, 204)
  }

  ResetContent(data: any) {
    return this.success(data || 'Reset Content', 205)
  }

  PartialContent(data: any) {
    return this.success(data || 'Partial Content', 206)
  }

  MultiStatus(data: any) {
    return this.success(data || 'Multi Status', 207)
  }

  AlreadyReported(data: any) {
    return this.success(data || 'Already Reported', 208)
  }

  IMUsed(data: any) {
    return this.success(data || 'IM Used', 226)
  }

  MultipleChoices(data: any) {
    return this.success(data || 'Multiple Choices', 300)
  }

  MovedPermanently(data: any) {
    return this.success(data || 'Moved Permanently', 301)
  }

  Found(data: any) {
    return this.success(data || 'Found', 302)
  }

  SeeOther(data: any) {
    return this.success(data || 'See Other', 303)
  }

  NotModified(data: any) {
    return this.success(data || 'Not Modified', 304)
  }

  UseProxy(data: any) {
    return this.success(data || 'Use Proxy', 305)
  }

  Unused(data: any) {
    return this.success(data || 'Unused', 306)
  }

  TemporaryRedirect(data: any) {
    return this.success(data || 'Temporary Redirect', 307)
  }

  PermanentRedirect(data: any) {
    return this.success(data || 'Permanent Redirect', 308)
  }

  // MARK: ERROR

  BadRequest(data: any) {
    return this.error(data || 'Bad Request', 400)
  }

  Unauthorized(data: any) {
    return this.error(data || 'Unauthorized', 401)
  }

  PaymentRequired(data: any) {
    return this.error(data || 'Payment Required', 402)
  }

  Forbidden(data: any) {
    return this.error(data || 'Forbidden', 403)
  }

  NotFound(data: any) {
    return this.error(data || 'Not Found', 404)
  }

  MethodNotAllowed(data: any) {
    return this.error(data || 'Method Not Allowed', 405)
  }

  NotAcceptable(data: any) {
    return this.error(data || 'Not Acceptable', 406)
  }

  ProxyAuthenticationRequired(data: any) {
    return this.error(data || 'Proxy Authentication Required', 407)
  }

  RequestTimeout(data: any) {
    return this.error(data || 'Request Timeout', 408)
  }

  Conflict(data: any) {
    return this.error(data || 'Conflict', 409)
  }

  Gone(data: any) {
    return this.error(data || 'Gone', 410)
  }

  LengthRequired(data: any) {
    return this.error(data || 'Length Required', 411)
  }

  PreconditionFailed(data: any) {
    return this.error(data || 'Precondition Failed', 412)
  }

  PayloadTooLarge(data: any) {
    return this.error(data || 'Payload TooLarge', 413)
  }

  URITooLong(data: any) {
    return this.error(data || 'URI Too Long', 414)
  }

  UnsupportedMediaType(data: any) {
    return this.error(data || 'Unsupported Media Type', 415)
  }

  RangeNotSatisfiable(data: any) {
    return this.error(data || 'Range Not Satisfiable', 416)
  }

  ExpectationFailed(data: any) {
    return this.error(data || 'Expectation Failed', 417)
  }

  ImATeapot(data: any) {
    return this.error(data || 'Im A Teapot', 418)
  }

  MisdirectedRequest(data: any) {
    return this.error(data || 'Misdirected Request', 421)
  }

  UnprocessableEntity(data: any) {
    return this.error(data || 'Unprocessable Entity', 422)
  }

  Locked(data: any) {
    return this.error(data || 'Locked', 423)
  }

  FailedDependency(data: any) {
    return this.error(data || 'Failed Dependency', 424)
  }

  UnorderedCollection(data: any) {
    return this.error(data || 'Unordered Collection', 425)
  }

  UpgradeRequired(data: any) {
    return this.error(data || 'Upgrade Required', 426)
  }

  PreconditionRequired(data: any) {
    return this.error(data || 'Precondition Required', 428)
  }

  TooManyRequests(data: any) {
    return this.error(data || 'Too Many Requests', 429)
  }

  RequestHeaderFieldsTooLarge(data: any) {
    return this.error(data || 'Request Header Fields Too Large', 431)
  }

  UnavailableForLegalReasons(data: any) {
    return this.error(data || 'Unavailable For Legal Reasons', 451)
  }

  InternalServerError(data: any) {
    return this.error(data || 'Internal Server Error', 500)
  }

  NotImplemented(data: any) {
    return this.error(data || 'Not Implemented', 501)
  }

  BadGateway(data: any) {
    return this.error(data || 'Bad Gateway', 502)
  }

  ServiceUnavailable(data: any) {
    return this.error(data || 'Service Unavailable', 503)
  }

  GatewayTimeout(data: any) {
    return this.error(data || 'Gateway Timeout', 504)
  }

  HTTPVersionNotSupported(data: any) {
    return this.error(data || 'HTTP Version Not Supported', 505)
  }

  VariantAlsoNegotiates(data: any) {
    return this.error(data || 'Variant Also Negotiates', 506)
  }

  InsufficientStorage(data: any) {
    return this.error(data || 'Insufficient Storage', 507)
  }

  LoopDetected(data: any) {
    return this.error(data || 'Loop Detected', 508)
  }

  BandwidthLimitExceeded(data: any) {
    return this.error(data || 'Bandwidth Limit Exceeded', 509)
  }

  NotExtended(data: any) {
    return this.error(data || 'Not Extended', 510)
  }

  NetworkAuthenticationRequired(data: any) {
    return this.error(data || 'Network Authentication Required', 511)
  }

}