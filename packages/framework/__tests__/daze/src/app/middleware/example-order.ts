import { BaseMiddleware, order } from '../../../../../src';

export class ExampleMiddlewareOrder extends BaseMiddleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder';
  }
}

@order(0)
export class ExampleMiddlewareOrder0 extends BaseMiddleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder0';
  }
}

@order(1)
export class ExampleMiddlewareOrder1 extends BaseMiddleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrder1';
  }
}

@order(Number.MAX_SAFE_INTEGER)
export class ExampleMiddlewareOrderMax extends BaseMiddleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMax';
  }
}

@order(Number.MIN_SAFE_INTEGER)
export class ExampleMiddlewareOrderMin extends BaseMiddleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMin';
  }
}

@order(Number.MAX_SAFE_INTEGER + 1)
export class ExampleMiddlewareOrderMax1 extends BaseMiddleware {
  resolve(): any | Promise<any> {
    return 'ExampleMiddlewareOrderMax1';
  }
}