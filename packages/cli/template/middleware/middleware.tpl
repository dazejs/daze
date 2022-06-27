import { Middleware, MiddlewareInterface, Request, Next } from '@tiger/common';

@Middleware()
export class {{ name | firstUpperCase }} implements MiddlewareInterface {
    async resolve(request: Request, next: Next) {
        // TODO before
        const response =  next();
        // TODO after
        return response;
    }
}