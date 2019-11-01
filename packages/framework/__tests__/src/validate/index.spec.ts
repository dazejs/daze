import 'reflect-metadata';
import path from 'path';
import { Validate } from '../../../src/validate';
import * as validators from '../../../src/validate/validators';
import { Application } from '../../../src/foundation/application';
import { Validator as ValidatorBase } from '../../../src/base/validator';
import { IsEmail } from '../../../src/decorators/validates';

const app = new Application(path.resolve(__dirname, '../../daze/src'));

beforeAll(() => app.initialize());

describe('Validate', () => {
  describe('Validate#rules', () => {
    it('should return structuring object array when rules is struct object', () => {
      const struct = {
        field: [
          ['isEmail', [], { message: '$field must be email' }],
        ],
      };
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, struct);

      expect(instance.rules).toEqual([
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
      class Validator extends ValidatorBase {
        @IsEmail()
        field: string;
      };
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, new Validator());
      expect(instance.rules).toEqual([{
        field: 'field',
        handler: validators.isEmail,
        args: [],
        options: {
          message: '$field must be an email',
        },
      }]);
    });

    it('should return structuring object array when rules is string', () => {
      class Validator extends ValidatorBase {
        @IsEmail()
        field: string;
      };

      app.bind('validator.example', Validator);
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 'example');
      expect(instance.rules).toEqual([{
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
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, struct);

      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is Validator instance without rules', () => {
      const Validator = class extends ValidatorBase {};
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, new Validator());
      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is conatiner instance without rules', () => {
      const Validator = class {};
      Reflect.defineMetadata('type', 'validator', Validator);
      app.bind('validator.example2', Validator);
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 'example2');
      expect(instance.rules).toEqual([]);
    });

    it('should return empty array when rules is a not bind conatiner instance string', () => {
      const instance = new Validate({
        field: 'xxx@xxx.com',
      }, 'example3');
      expect(instance.rules).toEqual([]);
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
      const instance = new Validate({});
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
      const instance = new Validate({
        username: 'xxxxxxxxxxx',
      });
      const res = instance.validateField(rule);
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
      const instance = new Validate({
        username: 'xxx',
      });
      const res = instance.validateField(rule);
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
      const instance = new Validate({
        username: 'xxxxx',
      });
      const res = instance.validateField(rule);
      expect(res).toBeFalsy();
      expect(instance.message.messages.length).toBe(1);
    });
  });

  describe('Validate#passes', () => {
    it('should return true when rules passed', () => {
      const instance = new Validate({
        passed: 'xxxxxxxxxxxx',
      }, {
          passed: [
          ['length', [10, 20]],
        ],
      });
      expect(instance.passes).toBeTruthy();
    });

    it('should return false when rules failed', () => {
      const instance = new Validate({
        passes: 'xxx',
      }, {
          passes: [
          ['length', [10, 20]],
        ],
      });
      expect(instance.passes).toBeFalsy();
    });
  });

  describe('Validate#fails', () => {
    it('should return false when rules passed', () => {
      const instance = new Validate({
        failed: 'xxxxxxxxxxxx',
      }, {
          failed: [
          ['length', [10, 20]],
        ],
      });
      expect(instance.fails).toBeFalsy();
    });

    it('should return true when rules failed', () => {
      const instance = new Validate({
        failed: 'xxx',
      }, {
          failed: [
          ['length', [10, 20]],
        ],
      });
      expect(instance.fails).toBeTruthy();
    });
  });

  describe('Validate#errors', () => {
    it('should return errors when validate failed', () => {
      const instance = new Validate({
        username: 'xxxxxxxxxxxx',
      }, {
        username: [
          ['length', [10, 20]],
        ],
      });
      instance.check();
      expect(instance.errors).toBe(instance.message.messages);
    });
  });
});
