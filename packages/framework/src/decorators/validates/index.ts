/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as validators from '../../validate/validators';
import { validatorFactory } from './factory';

// MARK: Custom

export const Passed  = function (options?: any) {
  return validatorFactory(validators.passed, [], {
    message: '$field must be passed!',
    ...options,
  });
};

// MARK: Common

export const Accepted = function (options?: any) {
  return validatorFactory(validators.accepted, [], {
    message: '$field must be yes,on or 1',
    ...options,
  });
};

export const Is = function (comparison: any, options?: any) {
  return validatorFactory(validators.is, [comparison], {
    message: '$field must is $1',
    ...options,
  });
};

export const Required = function (options?: any) {
  return validatorFactory(validators.required, [], {
    message: '$feild must not be undefined',
    ...options,
  });
};

export const Equals = function (comparison: any, options?: any) {
  return validatorFactory(validators.equals, [comparison], {
    message: '$field must be equal to $1',
    ...options,
  });
};

export const NotEquals = function (comparison: any, options?: any) {
  return validatorFactory(validators.notEquals, [comparison], {
    message: '$field shoud not equal to $1',
    ...options,
  });
};

export const IsEmpty  = function (options?: any) {
  return validatorFactory(validators.isEmpty, [], {
    message: '$field must be empty',
    ...options,
  });
};

export const IsNotEmpty  = function (options?: any) {
  return validatorFactory(validators.isNotEmpty, [], {
    message: '$field should not be empty',
    ...options,
  });
};

// MARK: Number

export const IsDivisibleBy = function (num: any, options?: any) {
  return validatorFactory(validators.isDivisibleBy, [num], {
    message: '$field must be divisible by $1',
    ...options,
  });
};

export const IsPositive  = function (options?: any) {
  return validatorFactory(validators.isPositive, [], {
    message: '$field must be a positive number',
    ...options,
  });
};

export const IsNegative  = function (options?: any) {
  return validatorFactory(validators.isNegative, [], {
    message: '$field must be a negative number',
    ...options,
  });
};

export const Min = function (min: any, options?: any) {
  return validatorFactory(validators.min, [min], {
    message: '$field must not be less than $1',
    ...options,
  });
};

export const Max = function (max: any, options?: any) {
  return validatorFactory(validators.max, [max], {
    message: '$field must not be greater than $1',
    ...options,
  });
};

// MARK: Date

export const AfterDate = function (date: any, options?: any) {
  return validatorFactory(validators.afterDate, [date], {
    message: '$field date must not be before than $1',
    ...options,
  });
};

export const BeforeDate = function (date: any, options?: any) {
  return validatorFactory(validators.beforeDate, [date], {
    message: '$field date must not be after than $1',
    ...options,
  });
};

// MARK: Type

export const IsBoolean  = function (options?: any) {
  return validatorFactory(validators.isBoolean, [], {
    message: '$field must be a boolean value',
    ...options,
  });
};

export const IsDate  = function (options?: any) {
  return validatorFactory(validators.isDate, [], {
    message: '$field must be a date value',
    ...options,
  });
};

export const IsString  = function (options?: any) {
  return validatorFactory(validators.isString, [], {
    message: '$field must be a string value',
    ...options,
  });
};

export const IsNumber  = function (options?: any) {
  return validatorFactory(validators.isNumber, [], {
    message: '$field must be a number value',
    ...options,
  });
};

export const IsArray  = function (options?: any) {
  return validatorFactory(validators.isArray, [], {
    message: '$field must be a array value',
    ...options,
  });
};

export const IsError  = function (options?: any) {
  return validatorFactory(validators.isError, [], {
    message: '$field must be an error',
    ...options,
  });
};

export const IsFunction  = function (options?: any) {
  return validatorFactory(validators.isFunction, [], {
    message: '$field must be a function',
    ...options,
  });
};

export const IsBuffer  = function (options?: any) {
  return validatorFactory(validators.isBuffer, [], {
    message: '$field must be a buffer',
    ...options,
  });
};

export const IsObject  = function (options?: any) {
  return validatorFactory(validators.isObject, [], {
    message: '$field must be an object value',
    ...options,
  });
};

export const IsRegExp  = function (options?: any) {
  return validatorFactory(validators.isRegExp, [], {
    message: '$field must be a regexp',
    ...options,
  });
};

export const IsSymbol  = function (options?: any) {
  return validatorFactory(validators.isSymbol, [], {
    message: '$field must be a symbol value',
    ...options,
  });
};

export const IsNullOrUndefined  = function (options?: any) {
  return validatorFactory(validators.isNullOrUndefined, [], {
    message: '$field must be null or undefined',
    ...options,
  });
};

export const IsNull  = function (options?: any) {
  return validatorFactory(validators.isNull, [], {
    message: '$field must be null',
    ...options,
  });
};

export const IsUndefined  = function (options?: any) {
  return validatorFactory(validators.isUndefined, [], {
    message: '$field must be undefined',
    ...options,
  });
};

// MARK: String Type

export const IsDateString  = function (options?: any) {
  return validatorFactory(validators.isDateString, [], {
    message: '$field must be a date string value',
    ...options,
  });
};

export const IsBooleanString  = function (options?: any) {
  return validatorFactory(validators.isBooleanString, [], {
    message: '$field must be a boolean string value',
    ...options,
  });
};

export const IsNumberString  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isNumberString, _options, {
    message: '$field must be a number string value',
    ...options,
  });
};

// MARK: String

export const Contains = function (seed: any, options?: any) {
  return validatorFactory(validators.contains, [seed], {
    message: '$field must contain a $1 string',
    ...options,
  });
};

export const NotContains = function (seed: any, options?: any) {
  return validatorFactory(validators.notContains, [seed], {
    message: '$field should not contain a $1 string',
    ...options,
  });
};

export const IsAlpha = function (locale?: any, options?: any) {
  const defaultMessage = '$field must contain only letters (a-zA-Z)';
  if (locale && typeof locale === 'object') {
    return validatorFactory(validators.isAlpha, [locale.locale], {
      message: defaultMessage,
      ...locale,
    });
  }
  return validatorFactory(validators.isAlpha, [locale], {
    message: defaultMessage,
    ...options,
  });
};

export const IsAlphanumeric = function (locale?: any, options?: any) {
  const defaultMessage = '$field must contain only letters and numbers';
  if (locale && typeof locale === 'object') {
    return validatorFactory(validators.isAlphanumeric, [locale.locale], {
      message: defaultMessage,
      ...locale,
    });
  }
  return validatorFactory(validators.isAlphanumeric, [locale], {
    message: defaultMessage,
    ...options,
  });
};

export const IsAscii  = function (options?: any) {
  return validatorFactory(validators.isAscii, [], {
    message: '$field must contain only ASCII characters',
    ...options,
  });
};

export const IsBase64  = function (options?: any) {
  return validatorFactory(validators.isBase64, [], {
    message: '$field must be base64 encoded',
    ...options,
  });
};

export const IsByteLength = function (min: any, max: any, options?: any) {
  return validatorFactory(validators.isByteLength, [min, max], {
    message: '$field\'s byte length must fall into($1, $2) range',
    ...options,
  });
};

export const IsCreditCard  = function (options?: any) {
  return validatorFactory(validators.isCreditCard, [], {
    message: '$field must be a credit card',
    ...options,
  });
};

export const IsCurrency  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isCurrency, _options, {
    message: '$field must be a currency',
    ...options,
  });
};

export const IsEmail  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isEmail, _options, {
    message: '$field must be an email',
    ...options,
  });
};

export const IsFQDN  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isFQDN, _options, {
    message: '$field must be a valid domain name',
    ...options,
  });
};

export const IsFullWidth  = function (options?: any) {
  return validatorFactory(validators.isFullWidth, [], {
    message: '$field must contain a full-width characters',
    ...options,
  });
};

export const IsHalfWidth  = function (options?: any) {
  return validatorFactory(validators.isHalfWidth, [], {
    message: '$field must contain a half-width characters',
    ...options,
  });
};

export const IsHexColor  = function (options?: any) {
  return validatorFactory(validators.isHexColor, [], {
    message: '$field must be a hex color',
    ...options,
  });
};

export const IsHexadecimal  = function (options?: any) {
  return validatorFactory(validators.isHexadecimal, [], {
    message: '$field must be a hexadecimal number',
    ...options,
  });
};

export const IsIP = function (version?: any, options?: any) {
  const defaultMessage = '$field must be an ip address';
  if (version && typeof version === 'object') {
    return validatorFactory(validators.isIP, [version.version], {
      message: defaultMessage,
      ...version,
    });
  }
  return validatorFactory(validators.isIP, [version], {
    message: defaultMessage,
    ...options,
  });
};

export const IsISBN = function (version?: any, options?: any) {
  const defaultMessage = '$field must be an ISBN';
  if (version && typeof version === 'object') {
    return validatorFactory(validators.isISBN, [version.version], {
      message: defaultMessage,
      ...version,
    });
  }
  return validatorFactory(validators.isISBN, [version], {
    message: defaultMessage,
    ...options,
  });
};

export const IsISSN  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isISSN, _options, {
    message: '$field must be an ISSN',
    ...options,
  });
};

export const IsISIN  = function (options?: any) {
  return validatorFactory(validators.isISIN, [], {
    message: '$field must be an ISIN (stock/security identifier)',
    ...options,
  });
};

export const IsISO8601  = function (options?: any) {
  return validatorFactory(validators.isISO8601, [], {
    message: '$field must be a valid ISO 8601 date string',
    ...options,
  });
};

export const IsJSON  = function (options?: any) {
  return validatorFactory(validators.isJSON, [], {
    message: '$field must be a json string',
    ...options,
  });
};

export const IsLowercase  = function (options?: any) {
  return validatorFactory(validators.isLowercase, [], {
    message: '$field must be a lowercase string',
    ...options,
  });
};

export const IsMobilePhone = function (locale?: any, options?: any) {
  if (locale && typeof locale === 'object') {
    return validatorFactory(validators.isMobilePhone, [locale.locale, locale], locale);
  }
  return validatorFactory(validators.isMobilePhone, [locale, options], {
    message: '$field must be a mobile phone number',
    ...options,
  });
};

export const IsMongoId  = function (options?: any) {
  return validatorFactory(validators.isMongoId, [], {
    message: '$field must be a mongodb id',
    ...options,
  });
};

export const IsMultibyte  = function (options?: any) {
  return validatorFactory(validators.isMultibyte, [], {
    message: '$field must contain one or more multibyte chars',
    ...options,
  });
};

export const IsSurrogatePair  = function (options?: any) {
  return validatorFactory(validators.isSurrogatePair, [], {
    message: '$field must contain any surrogate pairs chars',
    ...options,
  });
};

export const IsURL  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isURL, _options, {
    message: '$field must be an URL address',
    ...options,
  });
};

export const IsUUID = function (version?: any, options?: any) {
  const defaultMessage = '$field must be an UUID';
  if (version && typeof version === 'object') {
    return validatorFactory(validators.isUUID, [version.version], {
      message: defaultMessage,
      ...version,
    });
  }
  return validatorFactory(validators.isUUID, [version], {
    message: defaultMessage,
    ...options,
  });
};

export const IsUppercase  = function (options?: any) {
  return validatorFactory(validators.isUppercase, [], {
    message: '$field must be an uppercase string',
    ...options,
  });
};

export const Length = function (min: any, max: any, options?: any) {
  return validatorFactory(validators.length, [min, max], {
    message: '$field must be between $1 and $2',
    ...options,
  });
};

export const MinLength = function (min: any, options?: any) {
  return validatorFactory(validators.minLength, [min], {
    message: '$field must not be shorter than $1',
    ...options,
  });
};

export const MaxLength = function (max: any, options?: any) {
  return validatorFactory(validators.maxLength, [max], {
    message: '$field must not be longer than $1',
    ...options,
  });
};

export const Matches = function (pattern: any, modifiers?: any, options?: any) {
  const defaultMessage = '$field must match $1 regular expression';
  if (modifiers && typeof modifiers === 'object') {
    return validatorFactory(
      validators.matches,
      [pattern, modifiers.modifiers, modifiers],
      {
        message: defaultMessage,
        ...modifiers,
      },
    );
  }
  return validatorFactory(validators.matches, [pattern, modifiers, options], {
    message: defaultMessage,
    ...options,
  });
};
