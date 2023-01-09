import 'reflect-metadata';
import path from 'path';
import { Application, BaseValidator as ValidatorBase, IsEmail, Validator } from '../../../src';
import { Validate } from '../../../src/validate';
import * as validators from '../../../src/validate/validators';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../daze/src')
});

beforeAll(() => app.initialize());

describe('Validate', () => {
  describe('Validate#rules', () => {
    it('should return structuring object array when rules is struct object', () => {
      const struct = {
        field: [
          ['isEmail', [], { message: '$field must be email' }],
        ],
      };
      const instance: any = new Validate(struct).make({
        field: 'xxx@xxx.com',
      });

      expect(instance._rules).toEqual([
        {
          field: 'field',
          handler: validators.isEmail,
          args: [],
          options: {
            message: '$field must be email',
          },
        },
      ]);
    });

    it('should return structuring object array when rules is Validator instance', () => {
      @Validator()
      class TestValidator extends ValidatorBase {
        @IsEmail()
          field: string;
      }

      const instance: any = new Validate(TestValidator).make({
        field: 'xxx@xxx.com',
      });
      expect(instance._rules).toEqual([{
        field: 'field',
        handler: validators.isEmail,
        args: [],
        options: {
          message: '$field must be an email',
        },
      }]);
    });

    it('should return structuring object array when rules is string', () => {
      @Validator() class TestValidator extends ValidatorBase {
        @IsEmail()
          field: string;
      }

      app.bind('exampleResource1', TestValidator);
      const instance: any = new Validate('exampleResource1').make({
        field: 'xxx@xxx.com',
      });
      expect(instance._rules).toEqual([{
        field: 'field',
        handler: validators.isEmail,
        args: [],
        options: {
          message: '$field must be an email',
        },
      }]);
    });

    it('should return empty array when rules is empty stuct object', () => {
      const struct = {};
      const instance: any = new Validate(struct).make({
        field: 'xxx@xxx.com',
      });

      expect(instance._rules).toEqual([]);
    });

    it('should return empty array when rules is Validator instance without rules', () => {
      @Validator() class TestValidator extends ValidatorBase {}
      const instance: any = new Validate(TestValidator).make({
        field: 'xxx@xxx.com',
      });
      expect(instance._rules).toEqual([]);
    });

    it('should return empty array when rules is conatiner instance without rules', () => {
      @Validator() class TestValidator {}
      app.bind('validator.example2', TestValidator);
      const instance: any = new Validate('validator.example2').make({
        field: 'xxx@xxx.com',
      });
      expect(instance._rules).toEqual([]);
    });

    it('should return empty array when rules is a not bind conatiner instance string', () => {
      const instance: any = new Validate('example3').make({
        field: 'xxx@xxx.com',
      });
      expect(instance._rules).toEqual([]);
    });
  });

  describe('Validate#replaceSpecialMessageFields', () => {
    it('should replace predefine field with string', () => {
      const rule = {
        field: 'username',
        handler: validators.isEmail,
        args: [10, 20],
        options: {
          message: '$field: $value must be between $1 and $2',
        },
      };
      const instance: any = new Validate({});
      expect(instance.replaceSpecialMessageFields(100, rule)).toBe('username: 100 must be between 10 and 20');
    });
  });

  describe('Validate#validateField', () => {
    it('should return true and no message when rule validate passed', () => {
      
      const rule = {
        field: 'username',
        handler: validators.length,
        args: [10, 20],
        options: {
          message: '$field: $value must be between $1 and $2',
        },
      };
      const instance: any = new Validate({});
      const res = instance.validateField(rule, {
        username: 'xxxxxxxxxxx',
      });
      expect(res).toBeTruthy();
      expect(instance.message.messages.length).toBe(0);
    });

    it('should return false and message when rule validate failed', () => {
      
      const rule = {
        field: 'username',
        handler: validators.length,
        args: [10, 20],
        options: {
          message: '$field: $value must be between $1 and $2',
        },
      };
      const instance: any = new Validate({});
      const res = instance.validateField(rule, {
        username: 'xxx',
      });
      expect(res).toBeFalsy();
      expect(instance.message.messages.length).toBe(1);
    });

    it('should return false and message when handler err', () => {
      
      const rule = {
        field: 'username',
        handler: validators.length,
        args: [10, 20],
        options: {
          message: '$field: $value must be between $1 and $2',
        },
      };
      const instance: any = new Validate({});
      const res = instance.validateField(rule, {
        username: 'xxxxx',
      });
      expect(res).toBeFalsy();
      expect(instance.message.messages.length).toBe(1);
    });
  });

  describe('Validate#passes', () => {
    it('should return true when rules passed', () => {
      const instance = new Validate({
        passed: [
          ['length', [10, 20]],
        ],
      }).make({
        passed: 'xxxxxxxxxxxx',
      });
      expect(instance.passes).toBeTruthy();
    });

    it('should return false when rules failed', () => {
      const instance = new Validate({
        passes: [
          ['length', [10, 20]],
        ],
      }).make({
        passes: 'xxx',
      });
      expect(instance.passes).toBeFalsy();
    });
  });

  describe('Validate#fails', () => {
    it('should return false when rules passed', () => {
      const instance = new Validate({
        failed: [
          ['length', [10, 20]],
        ],
      }).make({
        failed: 'xxxxxxxxxxxx',
      });
      expect(instance.fails).toBeFalsy();
    });

    it('should return true when rules failed', () => {
      const instance = new Validate({
        failed: [
          ['length', [10, 20]],
        ],
      }).make({
        failed: 'xxx',
      });
      expect(instance.fails).toBeTruthy();
    });
  });

  describe('Validate#errors', () => {
    it('should return errors when validate failed', () => {
      const instance = new Validate({
        username: [
          ['length', [10, 20]],
        ],
      });
      instance.check({
        username: 'xxxxxxxxxxxx',
      });
      expect(instance.errors).toBe(instance.message.messages);
    });
  });
});
