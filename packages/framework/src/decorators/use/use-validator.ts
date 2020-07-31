import { useMiddleware } from './use-middleware';
import { ValidateMiddleware } from '../../validate/middleware/validate-middleware';


export const useValidator = function (validator: any): MethodDecorator {
  return useMiddleware(ValidateMiddleware, [validator]);
};

export const UseValidator = useValidator;