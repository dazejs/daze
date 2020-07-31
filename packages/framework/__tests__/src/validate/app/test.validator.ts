import { validator, BaseValidator, isEmail } from '../../../../src';

@validator()
export class TestValidator extends BaseValidator {
  @isEmail()
  username: string;
}