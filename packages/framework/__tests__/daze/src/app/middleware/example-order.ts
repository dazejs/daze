import { Order, Middleware } from '../../../../../src';

@Middleware()
export class ExampleMiddlewareOrder {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder';
  }
}

@Order(0)
@Middleware()
export class ExampleMiddlewareOrder0 {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder0';
  }
}

@Order(1)
@Middleware()
export class ExampleMiddlewareOrder1 {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder1';
  }
}

@Order(Number.MAX_SAFE_INTEGER)
@Middleware()
export class ExampleMiddlewareOrderMax {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMax';
  }
}

@Order(Number.MIN_SAFE_INTEGER)
@Middleware()
export class ExampleMiddlewareOrderMin {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMin';
  }
}

@Order(Number.MAX_SAFE_INTEGER + 1)
@Middleware()
export class ExampleMiddlewareOrderMax1 {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMax1';
  }
}