import { Middleware, Order } from '../../../../../src';

export class ExampleMiddlewareOrder extends Middleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder';
  }
}

@Order(0)
export class ExampleMiddlewareOrder0 extends Middleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder0';
  }
}

@Order(1)
export class ExampleMiddlewareOrder1 extends Middleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder1';
  }
}

@Order(Number.MAX_SAFE_INTEGER)
export class ExampleMiddlewareOrderMax extends Middleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMax';
  }
}

@Order(Number.MIN_SAFE_INTEGER)
export class ExampleMiddlewareOrderMin extends Middleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMin';
  }
}

@Order(Number.MAX_SAFE_INTEGER + 1)
export class ExampleMiddlewareOrderMax1 extends Middleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMax1';
  }
}