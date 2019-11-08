/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import is from 'core-util-is';

import * as validators from '../../validate/validators';
import { validatorFactory } from './factory';


// MARK: Custom

export function Passed (options?: any) {
  return validatorFactory(validators.passed, [], {
    message: '$field must be passed!',
    ...options,
  });
};

// MARK: Common

export function Accepted (options?: any) {
  return validatorFactory(validators.accepted, [], {
    message: '$field must be yes,on or 1',
    ...options,
  });
};

export function Is (comparison: any, options?: any) {
  return validatorFactory(validators.is, [comparison], {
    message: '$field must is $1',
    ...options,
  });
};

export function Required (options?: any) {
  return validatorFactory(validators.required, [], {
    message: '$feild must not be undefined',
    ...options,
  });
};

export function Equals(comparison: any, options?: any) {
  return validatorFactory(validators.equals, [comparison], {
    message: '$field must be equal to $1',
    ...options,
  });
};

export function NotEquals(comparison: any, options?: any) {
  return validatorFactory(validators.notEquals, [comparison], {
    message: '$field shoud not equal to $1',
    ...options,
  });
};

export function IsEmpty (options?: any) {
  return validatorFactory(validators.isEmpty, [], {
    message: '$field must be empty',
    ...options,
  });
};

export function IsNotEmpty (options?: any) {
  return validatorFactory(validators.isNotEmpty, [], {
    message: '$field should not be empty',
    ...options,
  });
};

// MARK: Number

export function IsDivisibleBy(num: any, options?: any) {
  return validatorFactory(validators.isDivisibleBy, [num], {
    message: '$field must be divisible by $1',
    ...options,
  });
};

export function IsPositive (options?: any) {
  return validatorFactory(validators.isPositive, [], {
    message: '$field must be a positive number',
    ...options,
  });
};

export function IsNegative (options?: any) {
  return validatorFactory(validators.isNegative, [], {
    message: '$field must be a negative number',
    ...options,
  });
};

export function Min(min: any, options?: any) {
  return validatorFactory(validators.min, [min], {
    message: '$field must not be less than $1',
    ...options,
  });
};

export function Max(max: any, options?: any) {
  return validatorFactory(validators.max, [max], {
    message: '$field must not be greater than $1',
    ...options,
  });
};


// MARK: Date

export function AfterDate(date: any, options?: any) {
  return validatorFactory(validators.afterDate, [date], {
    message: '$field date must not be before than $1',
    ...options,
  });
};

export function BeforeDate(date: any, options?: any) {
  return validatorFactory(validators.beforeDate, [date], {
    message: '$field date must not be after than $1',
    ...options,
  });
};

// MARK: Type

export function IsBoolean (options?: any) {
  return validatorFactory(validators.isBoolean, [], {
    message: '$field must be a boolean value',
    ...options,
  });
};

export function IsDate (options?: any) {
  return validatorFactory(validators.isDate, [], {
    message: '$field must be a date value',
    ...options,
  });
};

export function IsString (options?: any) {
  return validatorFactory(validators.isString, [], {
    message: '$field must be a string value',
    ...options,
  });
};

export function IsNumber (options?: any) {
  return validatorFactory(validators.isNumber, [], {
    message: '$field must be a number value',
    ...options,
  });
};

export function IsArray (options?: any) {
  return validatorFactory(validators.isArray, [], {
    message: '$field must be a array value',
    ...options,
  });
};

export function IsError (options?: any) {
  return validatorFactory(validators.isError, [], {
    message: '$field must be an error',
    ...options,
  });
};

export function IsFunction (options?: any) {
  return validatorFactory(validators.isFunction, [], {
    message: '$field must be a function',
    ...options,
  });
};

export function IsBuffer (options?: any) {
  return validatorFactory(validators.isBuffer, [], {
    message: '$field must be a buffer',
    ...options,
  });
};

export function IsObject (options?: any) {
  return validatorFactory(validators.isObject, [], {
    message: '$field must be an object value',
    ...options,
  });
};

export function IsRegExp (options?: any) {
  return validatorFactory(validators.isRegExp, [], {
    message: '$field must be a regexp',
    ...options,
  });
};

export function IsSymbol (options?: any) {
  return validatorFactory(validators.isSymbol, [], {
    message: '$field must be a symbol value',
    ...options,
  });
};

export function IsNullOrUndefined (options?: any) {
  return validatorFactory(validators.isNullOrUndefined, [], {
    message: '$field must be null or undefined',
    ...options,
  });
};

export function IsNull (options?: any) {
  return validatorFactory(validators.isNull, [], {
    message: '$field must be null',
    ...options,
  });
};

export function IsUndefined (options?: any) {
  return validatorFactory(validators.isUndefined, [], {
    message: '$field must be undefined',
    ...options,
  });
};

// MARK: String Type

export function IsDateString (options?: any) {
  return validatorFactory(validators.isDateString, [], {
    message: '$field must be a date string value',
    ...options,
  });
};

export function IsBooleanString (options?: any) {
  return validatorFactory(validators.isBooleanString, [], {
    message: '$field must be a boolean string value',
    ...options,
  });
};

export function IsNumberString (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isNumberString, _options, {
    message: '$field must be a number string value',
    ...options,
  });
};


// MARK: String

export function Contains(seed: any, options?: any) {
  return validatorFactory(validators.contains, [seed], {
    message: '$field must contain a $1 string',
    ...options,
  });
};

export function NotContains(seed: any, options?: any) {
  return validatorFactory(validators.notContains, [seed], {
    message: '$field should not contain a $1 string',
    ...options,
  });
};

export function IsAlpha(locale?: any, options?: any) {
  const defaultMessage = '$field must contain only letters (a-zA-Z)';
  if (is.isObject(locale)) {
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

export function IsAlphanumeric(locale?: any, options?: any) {
  const defaultMessage = '$field must contain only letters and numbers';
  if (is.isObject(locale)) {
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

export function IsAscii (options?: any) {
  return validatorFactory(validators.isAscii, [], {
    message: '$field must contain only ASCII characters',
    ...options,
  });
};

export function IsBase64 (options?: any) {
  return validatorFactory(validators.isBase64, [], {
    message: '$field must be base64 encoded',
    ...options,
  });
};

export function IsByteLength(min: any, max: any, options?: any) {
  return validatorFactory(validators.isByteLength, [min, max], {
    message: '$field\'s byte length must fall into($1, $2) range',
    ...options,
  });
};

export function IsCreditCard (options?: any) {
  return validatorFactory(validators.isCreditCard, [], {
    message: '$field must be a credit card',
    ...options,
  });
};

export function IsCurrency (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isCurrency, _options, {
    message: '$field must be a currency',
    ...options,
  });
};

export function IsEmail (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isEmail, _options, {
    message: '$field must be an email',
    ...options,
  });
};

export function IsFQDN (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isFQDN, _options, {
    message: '$field must be a valid domain name',
    ...options,
  });
};

export function IsFullWidth (options?: any) {
  return validatorFactory(validators.isFullWidth, [], {
    message: '$field must contain a full-width characters',
    ...options,
  });
};

export function IsHalfWidth (options?: any) {
  return validatorFactory(validators.isHalfWidth, [], {
    message: '$field must contain a half-width characters',
    ...options,
  });
};

export function IsHexColor (options?: any) {
  return validatorFactory(validators.isHexColor, [], {
    message: '$field must be a hex color',
    ...options,
  });
};

export function IsHexadecimal (options?: any) {
  return validatorFactory(validators.isHexadecimal, [], {
    message: '$field must be a hexadecimal number',
    ...options,
  });
};

export function IsIP(version?: any, options?: any) {
  const defaultMessage = '$field must be an ip address';
  if (is.isObject(version)) {
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

export function IsISBN(version?: any, options?: any) {
  const defaultMessage = '$field must be an ISBN';
  if (is.isObject(version)) {
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

export function IsISSN (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isISSN, _options, {
    message: '$field must be an ISSN',
    ...options,
  });
};

export function IsISIN (options?: any) {
  return validatorFactory(validators.isISIN, [], {
    message: '$field must be an ISIN (stock/security identifier)',
    ...options,
  });
};

export function IsISO8601 (options?: any) {
  return validatorFactory(validators.isISO8601, [], {
    message: '$field must be a valid ISO 8601 date string',
    ...options,
  });
};

export function IsJSON (options?: any) {
  return validatorFactory(validators.isJSON, [], {
    message: '$field must be a json string',
    ...options,
  });
};

export function IsLowercase (options?: any) {
  return validatorFactory(validators.isLowercase, [], {
    message: '$field must be a lowercase string',
    ...options,
  });
};

export function IsMobilePhone(locale?: any, options?: any) {
  if (is.isObject(locale)) {
    return validatorFactory(validators.isMobilePhone, [locale.locale, locale], locale);
  }
  return validatorFactory(validators.isMobilePhone, [locale, options], {
    message: '$field must be a mobile phone number',
    ...options,
  });
};

export function IsMongoId (options?: any) {
  return validatorFactory(validators.isMongoId, [], {
    message: '$field must be a mongodb id',
    ...options,
  });
};

export function IsMultibyte (options?: any) {
  return validatorFactory(validators.isMultibyte, [], {
    message: '$field must contain one or more multibyte chars',
    ...options,
  });
};

export function IsSurrogatePair (options?: any) {
  return validatorFactory(validators.isSurrogatePair, [], {
    message: '$field must contain any surrogate pairs chars',
    ...options,
  });
};

export function IsURL (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isURL, _options, {
    message: '$field must be an URL address',
    ...options,
  });
};

export function IsUUID(version?: any, options?: any) {
  const defaultMessage = '$field must be an UUID';
  if (is.isObject(version)) {
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

export function IsUppercase (options?: any) {
  return validatorFactory(validators.isUppercase, [], {
    message: '$field must be an uppercase string',
    ...options,
  });
};

export function Length(min: any, max: any, options?: any) {
  return validatorFactory(validators.length, [min, max], {
    message: '$field must be between $1 and $2',
    ...options,
  });
};

export function MinLength(min: any, options?: any) {
  return validatorFactory(validators.minLength, [min], {
    message: '$field must not be shorter than $1',
    ...options,
  });
};

export function MaxLength(max: any, options?: any) {
  return validatorFactory(validators.maxLength, [max], {
    message: '$field must not be longer than $1',
    ...options,
  });
};

export function Matches(pattern: any, modifiers?: any, options?: any) {
  const defaultMessage = '$field must match $1 regular expression';
  if (is.isObject(modifiers)) {
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
