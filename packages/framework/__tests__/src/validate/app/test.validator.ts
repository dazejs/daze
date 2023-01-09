import { Validator, BaseValidator, IsEmail } from '../../../../src';

@Validator()
export class TestValidator extends BaseValidator {
  @IsEmail()
    username: string;
}