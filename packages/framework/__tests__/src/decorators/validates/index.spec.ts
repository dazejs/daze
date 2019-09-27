import 'reflect-metadata';
import * as Decrators from '../../../../src/decorators/validates';
import * as Validators from '../../../../src/validate/validators';

describe('validate decrators', () => {
  it('should patch passed rule with @Passed', () => {
    const options = {};
    class Example {
      @Decrators.Passed()
      example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.passed,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch accepted rule with @Accepted', () => {
    const options = {};
    class Example {
      @Decrators.Accepted(options)
      example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.accepted,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch is rule with @Is', () => {
    const options = {};
    class Example {
      @Decrators.Is('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.is,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch required rule with @Required', () => {
    const options = {};
    class Example {
      @Decrators.Required(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.required,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch equals rule with @Equals', () => {
    const options = {};
    class Example {
      @Decrators.Equals('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.equals,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsEmpty rule with @IsEmpty', () => {
    const options = {};
    class Example {
      @Decrators.IsEmpty(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isEmpty,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNotEmpty rule with @IsNotEmpty', () => {
    const options = {};
    class Example {
      @Decrators.IsNotEmpty(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNotEmpty,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsDivisibleBy rule with @IsDivisibleBy', () => {
    const options = {};
    class Example {
      @Decrators.IsDivisibleBy(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isDivisibleBy,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });


  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================


  it('should patch IsPositive rule with @IsPositive', () => {
    const options = {};
    class Example {
      @Decrators.IsPositive(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isPositive,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNegative rule with @IsNegative', () => {
    const options = {};
    class Example {
      @Decrators.IsNegative(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNegative,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Min rule with @Min', () => {
    const options = {};
    class Example {
      @Decrators.Min(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.min,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Max rule with @Max', () => {
    const options = {};
    class Example {
      @Decrators.Max(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.max,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });


  it('should patch AfterDate rule with @AfterDate', () => {
    const options = {};
    class Example {
      @Decrators.AfterDate(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.afterDate,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch BeforeDate rule with @BeforeDate', () => {
    const options = {};
    class Example {
      @Decrators.BeforeDate(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.beforeDate,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBoolean rule with @IsBoolean', () => {
    const options = {};
    class Example {
      @Decrators.IsBoolean(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBoolean,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsDate rule with @IsDate', () => {
    const options = {};
    class Example {
      @Decrators.IsDate(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isDate,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsString rule with @IsString', () => {
    const options = {};
    class Example {
      @Decrators.IsString(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isString,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNumber rule with @IsNumber', () => {
    const options = {};
    class Example {
      @Decrators.IsNumber(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNumber,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsArray rule with @IsArray', () => {
    const options = {};
    class Example {
      @Decrators.IsArray(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isArray,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsError rule with @IsError', () => {
    const options = {};
    class Example {
      @Decrators.IsError(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isError,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsFunction rule with @IsFunction', () => {
    const options = {};
    class Example {
      @Decrators.IsFunction(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isFunction,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBuffer rule with @IsBuffer', () => {
    const options = {};
    class Example {
      @Decrators.IsBuffer(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBuffer,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsObject rule with @IsObject', () => {
    const options = {};
    class Example {
      @Decrators.IsObject(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isObject,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsRegExp rule with @IsRegExp', () => {
    const options = {};
    class Example {
      @Decrators.IsRegExp(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isRegExp,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsSymbol rule with @IsSymbol', () => {
    const options = {};
    class Example {
      @Decrators.IsSymbol(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isSymbol,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNullOrUndefined rule with @IsNullOrUndefined', () => {
    const options = {};
    class Example {
      @Decrators.IsNullOrUndefined(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNullOrUndefined,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNull rule with @IsNull', () => {
    const options = {};
    class Example {
      @Decrators.IsNull(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNull,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsUndefined rule with @IsUndefined', () => {
    const options = {};
    class Example {
      @Decrators.IsUndefined(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isUndefined,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsDateString rule with @IsDateString', () => {
    const options = {};
    class Example {
      @Decrators.IsDateString(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isDateString,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBooleanString rule with @IsBooleanString', () => {
    const options = {};
    class Example {
      @Decrators.IsBooleanString(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBooleanString,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNumberString rule with @IsNumberString', () => {
    const options = {};
    class Example {
      @Decrators.IsNumberString(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNumberString,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Contains rule with @Contains', () => {
    const options = {};
    class Example {
      @Decrators.Contains('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.contains,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch NotContains rule with @NotContains', () => {
    const options = {};
    class Example {
      @Decrators.NotContains('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.notContains,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsAlpha rule with @IsAlpha', () => {
    const options = {};
    class Example {
      @Decrators.IsAlpha('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isAlpha,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsAlphanumeric rule with @IsAlphanumeric', () => {
    const options = {};
    class Example {
      @Decrators.IsAlphanumeric('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isAlphanumeric,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsAscii rule with @IsAscii', () => {
    const options = {};
    class Example {
      @Decrators.IsAscii(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isAscii,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBase64 rule with @IsBase64', () => {
    const options = {};
    class Example {
      @Decrators.IsBase64(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBase64,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsByteLength rule with @IsByteLength', () => {
    const options = {};
    class Example {
      @Decrators.IsByteLength('test', 'test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isByteLength,
        args: ['test', 'test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsCreditCard rule with @IsCreditCard', () => {
    const options = {};
    class Example {
      @Decrators.IsCreditCard(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isCreditCard,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsCurrency rule with @IsCurrency', () => {
    const options = {};
    class Example {
      @Decrators.IsCurrency(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isCurrency,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsEmail rule with @IsEmail', () => {
    const options = {};
    class Example {
      @Decrators.IsEmail(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isEmail,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsFQDN rule with @IsFQDN', () => {
    const options = {};
    class Example {
      @Decrators.IsFQDN(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isFQDN,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsFullWidth rule with @IsFullWidth', () => {
    const options = {};
    class Example {
      @Decrators.IsFullWidth(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isFullWidth,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsHalfWidth rule with @IsHalfWidth', () => {
    const options = {};
    class Example {
      @Decrators.IsHalfWidth(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isHalfWidth,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsHexColor rule with @IsHexColor', () => {
    const options = {};
    class Example {
      @Decrators.IsHexColor(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isHexColor,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsHexadecimal rule with @IsHexadecimal', () => {
    const options = {};
    class Example {
      @Decrators.IsHexadecimal(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isHexadecimal,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsIP rule with @IsIP', () => {
    const options = {};
    class Example {
      @Decrators.IsIP('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isIP,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISBN rule with @IsISBN', () => {
    const options = {};
    class Example {
      @Decrators.IsISBN('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISBN,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISSN rule with @IsISSN', () => {
    const options = {};
    class Example {
      @Decrators.IsISSN(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISSN,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISIN rule with @IsISIN', () => {
    const options = {};
    class Example {
      @Decrators.IsISIN(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISIN,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISO8601 rule with @IsISO8601', () => {
    const options = {};
    class Example {
      @Decrators.IsISO8601(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISO8601,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsJSON rule with @IsJSON', () => {
    const options = {};
    class Example {
      @Decrators.IsJSON(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isJSON,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsLowercase rule with @IsLowercase', () => {
    const options = {};
    class Example {
      @Decrators.IsLowercase(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isLowercase,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsMobilePhone rule with @IsMobilePhone', () => {
    const options = {};
    class Example {
      @Decrators.IsMobilePhone('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isMobilePhone,
        args: ['test', options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsMongoId rule with @IsMongoId', () => {
    const options = {};
    class Example {
      @Decrators.IsMongoId(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isMongoId,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsMultibyte rule with @IsMultibyte', () => {
    const options = {};
    class Example {
      @Decrators.IsMultibyte(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isMultibyte,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsSurrogatePair rule with @IsSurrogatePair', () => {
    const options = {};
    class Example {
      @Decrators.IsSurrogatePair(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isSurrogatePair,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsURL rule with @IsURL', () => {
    const options = {};
    class Example {
      @Decrators.IsURL(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isURL,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsUUID rule with @IsUUID', () => {
    const options = {};
    class Example {
      @Decrators.IsUUID('test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isUUID,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsUppercase rule with @IsUppercase', () => {
    const options = {};
    class Example {
      @Decrators.IsUppercase(options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isUppercase,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Length rule with @Length', () => {
    const options = {};
    class Example {
      @Decrators.Length(1, 10, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.length,
        args: [1, 10],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch MinLength rule with @MinLength', () => {
    const options = {};
    class Example {
      @Decrators.MinLength(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.minLength,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });
  it('should patch MaxLength rule with @MaxLength', () => {
    const options = {};
    class Example {
      @Decrators.MaxLength(1, options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.maxLength,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });
  it('should patch Matches rule with @Matches', () => {
    const options = {};
    class Example {
      @Decrators.Matches('test', 'test', options) example: any;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.matches,
        args: ['test', 'test', options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });
});
