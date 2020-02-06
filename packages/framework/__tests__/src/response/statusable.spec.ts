import { Response } from '../../../src/response';

describe('Response statusable', () => {
  it('should return 100', () => {
    const response = new Response();
    expect(response.Continue().getCode()).toBe(100);
    expect(response.continue().getCode()).toBe(100);
  });

  it('should return 101', () => {
    const response = new Response();
    expect(response.SwitchingProtocols().getCode()).toBe(101);
    expect(response.switchingProtocols().getCode()).toBe(101);
  });

  it('should return 102', () => {
    const response = new Response();
    expect(response.Processing().getCode()).toBe(102);
    expect(response.processing().getCode()).toBe(102);
  });

  it('should return 103', () => {
    const response = new Response();
    expect(response.EarlyHints().getCode()).toBe(103);
    expect(response.earlyHints().getCode()).toBe(103);
  });

  it('should return 200', () => {
    const response = new Response();
    expect(response.OK().getCode()).toBe(200);
    expect(response.ok().getCode()).toBe(200);
  });

  it('should return 201', () => {
    const response = new Response();
    expect(response.Created().getCode()).toBe(201);
    expect(response.created().getCode()).toBe(201);
  });

  it('should return 202', () => {
    const response = new Response();
    expect(response.Accepted().getCode()).toBe(202);
    expect(response.accepted().getCode()).toBe(202);
  });

  it('should return 203', () => {
    const response = new Response();
    expect(response.NonAuthoritativeInformation().getCode()).toBe(203);
    expect(response.nonAuthoritativeInformation().getCode()).toBe(203);
  });

  it('should return 204', () => {
    const response = new Response();
    expect(response.NoContent().getCode()).toBe(204);
    expect(response.noContent().getCode()).toBe(204);
  });

  it('should return 205', () => {
    const response = new Response();
    expect(response.ResetContent().getCode()).toBe(205);
    expect(response.resetContent().getCode()).toBe(205);
  });

  it('should return 206', () => {
    const response = new Response();
    expect(response.PartialContent().getCode()).toBe(206);
    expect(response.partialContent().getCode()).toBe(206);
  });

  it('should return 207', () => {
    const response = new Response();
    expect(response.MultiStatus().getCode()).toBe(207);
    expect(response.multiStatus().getCode()).toBe(207);
  });

  it('should return 208', () => {
    const response = new Response();
    expect(response.AlreadyReported().getCode()).toBe(208);
    expect(response.alreadyReported().getCode()).toBe(208);
  });

  it('should return 226', () => {
    const response = new Response();
    expect(response.IMUsed().getCode()).toBe(226);
    expect(response.imUsed().getCode()).toBe(226);
  });

  it('should return 300', () => {
    const response = new Response();
    expect(response.MultipleChoices().getCode()).toBe(300);
    expect(response.multipleChoices().getCode()).toBe(300);
  });

  it('should return 301', () => {
    const response = new Response();
    expect(response.MovedPermanently().getCode()).toBe(301);
    expect(response.movedPermanently().getCode()).toBe(301);
  });

  it('should return 302', () => {
    const response = new Response();
    expect(response.Found().getCode()).toBe(302);
    expect(response.found().getCode()).toBe(302);
  });
  it('should return 303', () => {
    const response = new Response();
    expect(response.SeeOther().getCode()).toBe(303);
    expect(response.seeOther().getCode()).toBe(303);
  });

  it('should return 304', () => {
    const response = new Response();
    expect(response.NotModified().getCode()).toBe(304);
    expect(response.notModified().getCode()).toBe(304);
  });

  it('should return 305', () => {
    const response = new Response();
    expect(response.UseProxy().getCode()).toBe(305);
    expect(response.useProxy().getCode()).toBe(305);
  });

  it('should return 306', () => {
    const response = new Response();
    expect(response.Unused().getCode()).toBe(306);
    expect(response.unused().getCode()).toBe(306);
  });

  it('should return 307', () => {
    const response = new Response();
    expect(response.TemporaryRedirect().getCode()).toBe(307);
    expect(response.temporaryRedirect().getCode()).toBe(307);
  });

  it('should return 308', () => {
    const response = new Response();
    expect(response.PermanentRedirect().getCode()).toBe(308);
    expect(response.permanentRedirect().getCode()).toBe(308);
  });

  it('should return 400', () => {
    const response = new Response();
    expect(response.BadRequest().getCode()).toBe(400);
    expect(response.badRequest().getCode()).toBe(400);
  });

  it('should return 401', () => {
    const response = new Response();
    expect(response.Unauthorized().getCode()).toBe(401);
    expect(response.unauthorized().getCode()).toBe(401);
  });

  it('should return 402', () => {
    const response = new Response();
    expect(response.PaymentRequired().getCode()).toBe(402);
    expect(response.paymentRequired().getCode()).toBe(402);
  });

  it('should return 403', () => {
    const response = new Response();
    expect(response.Forbidden().getCode()).toBe(403);
    expect(response.forbidden().getCode()).toBe(403);
  });

  it('should return 404', () => {
    const response = new Response();
    expect(response.NotFound().getCode()).toBe(404);
    expect(response.notFound().getCode()).toBe(404);
  });

  it('should return 405', () => {
    const response = new Response();
    expect(response.MethodNotAllowed().getCode()).toBe(405);
    expect(response.methodNotAllowed().getCode()).toBe(405);
  });

  it('should return 406', () => {
    const response = new Response();
    expect(response.NotAcceptable().getCode()).toBe(406);
    expect(response.notAcceptable().getCode()).toBe(406);
  });

  it('should return 407', () => {
    const response = new Response();
    expect(response.ProxyAuthenticationRequired().getCode()).toBe(407);
    expect(response.proxyAuthenticationRequired().getCode()).toBe(407);
  });

  it('should return 408', () => {
    const response = new Response();
    expect(response.RequestTimeout().getCode()).toBe(408);
    expect(response.requestTimeout().getCode()).toBe(408);
  });

  it('should return 409', () => {
    const response = new Response();
    expect(response.Conflict().getCode()).toBe(409);
    expect(response.conflict().getCode()).toBe(409);
  });

  it('should return 410', () => {
    const response = new Response();
    expect(response.Gone().getCode()). toBe(410);
    expect(response.gone().getCode()).toBe(410);
  });

  it('should return 411', () => {
    const response = new Response();
    expect(response.LengthRequired().getCode()).toBe(411);
    expect(response.lengthRequired().getCode()).toBe(411);
  });

  it('should return 412', () => {
    const response = new Response();
    expect(response.PreconditionFailed().getCode()).toBe(412);
    expect(response.preconditionFailed().getCode()).toBe(412);
  });

  it('should return 413', () => {
    const response = new Response();
    expect(response.PayloadTooLarge().getCode()).toBe(413);
    expect(response.payloadTooLarge().getCode()).toBe(413);
  });

  it('should return 414', () => {
    const response = new Response();
    expect(response.URITooLong().getCode()).toBe(414);
    expect(response.uriTooLong().getCode()).toBe(414);
  });

  it('should return 415', () => {
    const response = new Response();
    expect(response.UnsupportedMediaType().getCode()).toBe(415);
    expect(response.unsupportedMediaType().getCode()).toBe(415);
  });

  it('should return 416', () => {
    const response = new Response();
    expect(response.RangeNotSatisfiable().getCode()).toBe(416);
    expect(response.rangeNotSatisfiable().getCode()).toBe(416);
  });

  it('should return 417', () => {
    const response = new Response();
    expect(response.ExpectationFailed().getCode()).toBe(417);
    expect(response.expectationFailed().getCode()).toBe(417);
  });

  it('should return 418', () => {
    const response = new Response();
    expect(response.ImATeapot().getCode()).toBe(418);
    expect(response.imATeapot().getCode()).toBe(418);
  });

  it('should return 421', () => {
    const response = new Response();
    expect(response.MisdirectedRequest().getCode()).toBe(421);
    expect(response.misdirectedRequest().getCode()).toBe(421);
  });

  it('should return 422', () => {
    const response = new Response();
    expect(response.UnprocessableEntity().getCode()).toBe(422);
    expect(response.unprocessableEntity().getCode()).toBe(422);
  });

  it('should return 423', () => {
    const response = new Response();
    expect(response. Locked().getCode()).toBe(423);
    expect(response. locked().getCode()).toBe(423);
  });

  it('should return 424', () => {
    const response = new Response();
    expect(response.FailedDependency().getCode()).toBe(424);
    expect(response.failedDependency().getCode()).toBe(424);
  });

  it('should return 425', () => {
    const response = new Response();
    expect(response.UnorderedCollection().getCode()).toBe(425);
    expect(response.unorderedCollection().getCode()).toBe(425);
  });

  it('should return 426', () => {
    const response = new Response();
    expect(response.UpgradeRequired().getCode()).toBe(426);
    expect(response.upgradeRequired().getCode()).toBe(426);
  });

  it('should return 428', () => {
    const response = new Response();
    expect(response.PreconditionRequired().getCode()).toBe(428);
    expect(response.preconditionRequired().getCode()).toBe(428);
  });

  it('should return 429', () => {
    const response = new Response();
    expect(response.TooManyRequests().getCode()).toBe(429);
    expect(response.tooManyRequests().getCode()).toBe(429);
  });

  it('should return 431', () => {
    const response = new Response();
    expect(response.RequestHeaderFieldsTooLarge().getCode()).toBe(431);
    expect(response.requestHeaderFieldsTooLarge().getCode()).toBe(431);
  });

  it('should return 451', () => {
    const response = new Response();
    expect(response.UnavailableForLegalReasons().getCode()).toBe(451);
    expect(response.unavailableForLegalReasons().getCode()).toBe(451);
  });

  it('should return 500', () => {
    const response = new Response();
    expect(response.InternalServerError().getCode()).toBe(500);
    expect(response.internalServerError().getCode()).toBe(500);
  });

  it('should return 501', () => {
    const response = new Response();
    expect(response.NotImplemented().getCode()).toBe(501);
    expect(response.notImplemented().getCode()).toBe(501);
  });

  it('should return 502', () => {
    const response = new Response();
    expect(response.BadGateway().getCode()).toBe(502);
    expect(response.badGateway().getCode()).toBe(502);
  });

  it('should return 503', () => {
    const response = new Response();
    expect(response.ServiceUnavailable().getCode()).toBe(503);
    expect(response.serviceUnavailable().getCode()).toBe(503);
  });

  it('should return 504', () => {
    const response = new Response();
    expect(response.GatewayTimeout().getCode()).toBe(504);
    expect(response.gatewayTimeout().getCode()).toBe(504);
  });

  it('should return 505', () => {
    const response = new Response();
    expect(response.HTTPVersionNotSupported().getCode()).toBe(505);
    expect(response.httpVersionNotSupported().getCode()).toBe(505);
  });

  it('should return 506', () => {
    const response = new Response();
    expect(response.VariantAlsoNegotiates().getCode()).toBe(506);
    expect(response.variantAlsoNegotiates().getCode()).toBe(506);
  });

  it('should return 507', () => {
    const response = new Response();
    expect(response.InsufficientStorage().getCode()).toBe(507);
    expect(response.insufficientStorage().getCode()).toBe(507);
  });

  it('should return 508', () => {
    const response = new Response();
    expect(response.LoopDetected().getCode()).toBe(508);
    expect(response.loopDetected().getCode()).toBe(508);
  });

  it('should return 509', () => {
    const response = new Response();
    expect(response.BandwidthLimitExceeded().getCode()).toBe(509);
    expect(response.bandwidthLimitExceeded().getCode()).toBe(509);
  });

  it('should return 510', () => {
    const response = new Response();
    expect(response.NotExtended().getCode()).toBe(510);
    expect(response.notExtended().getCode()).toBe(510);
  });

  it('should return 511', () => {
    const response = new Response();
    expect(response.NetworkAuthenticationRequired().getCode()).toBe(511);
    expect(response.networkAuthenticationRequired().getCode()).toBe(511);
  });
});