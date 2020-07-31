import { middleware } from '../../decorators';
import { MiddlewareInterface } from '../../interfaces';
import { Request } from '../../request';
import { Next } from '../../middleware';



@middleware()
export class ValidateMiddleware implements MiddlewareInterface {

  private validator: any;

  constructor(validator: any) {
    this.validator = validator;
  }

  resolve(request: Request, next: Next) {
    if (this.validator) {
      request.validate(this.validator);
    }
    return next();
  }
}