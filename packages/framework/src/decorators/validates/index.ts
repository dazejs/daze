/**
 * Copyright (c) 2020 Chan Zewail
 *
 * This software is released under the MIT License.
 * https: //opensource.org/licenses/MIT
 */

import * as validators from '../../validate/validators';
import { validatorFactory } from './factory';

// MARK: Custom

export const passed  = function (options?: any) {
  return validatorFactory(validators.passed, [], {
    message: '$field must be passed!',
    ...options,
  });
};

export const Passed = passed;

// MARK: Common

export const accepted = function (options?: any) {
  return validatorFactory(validators.accepted, [], {
    message: '$field must be yes,on or 1',
    ...options,
  });
};

export const Accepted = accepted;

export const is = function (comparison: any, options?: any) {
  return validatorFactory(validators.is, [comparison], {
    message: '$field must is $1',
    ...options,
  });
};

export const Is = is;

export const required = function (options?: any) {
  return validatorFactory(validators.required, [], {
    message: '$feild must not be undefined',
    ...options,
  });
};

export const Required = required;

export const equals = function (comparison: any, options?: any) {
  return validatorFactory(validators.equals, [comparison], {
    message: '$field must be equal to $1',
    ...options,
  });
};

export const Equals = equals;

export const notEquals = function (comparison: any, options?: any) {
  return validatorFactory(validators.notEquals, [comparison], {
    message: '$field shoud not equal to $1',
    ...options,
  });
};

export const NotEquals = notEquals;

export const isEmpty  = function (options?: any) {
  return validatorFactory(validators.isEmpty, [], {
    message: '$field must be empty',
    ...options,
  });
};

export const IsEmpty = isEmpty;

export const isNotEmpty  = function (options?: any) {
  return validatorFactory(validators.isNotEmpty, [], {
    message: '$field should not be empty',
    ...options,
  });
};

export const IsNotEmpty = isNotEmpty;

// MARK: Number

export const isDivisibleBy = function (num: any, options?: any) {
  return validatorFactory(validators.isDivisibleBy, [num], {
    message: '$field must be divisible by $1',
    ...options,
  });
};

export const IsDivisibleBy = isDivisibleBy;

export const isPositive  = function (options?: any) {
  return validatorFactory(validators.isPositive, [], {
    message: '$field must be a positive number',
    ...options,
  });
};

export const IsPositive = isPositive;

export const isNegative  = function (options?: any) {
  return validatorFactory(validators.isNegative, [], {
    message: '$field must be a negative number',
    ...options,
  });
};

export const IsNegative = isNegative;

export const min = function (min: any, options?: any) {
  return validatorFactory(validators.min, [min], {
    message: '$field must not be less than $1',
    ...options,
  });
};

export const Min = min;

export const max = function (max: any, options?: any) {
  return validatorFactory(validators.max, [max], {
    message: '$field must not be greater than $1',
    ...options,
  });
};

export const Max = max;

// MARK: Date

export const afterDate = function (date: any, options?: any) {
  return validatorFactory(validators.afterDate, [date], {
    message: '$field date must not be before than $1',
    ...options,
  });
};

export const AfterDate = afterDate;

export const beforeDate = function (date: any, options?: any) {
  return validatorFactory(validators.beforeDate, [date], {
    message: '$field date must not be after than $1',
    ...options,
  });
};

export const BeforeDate = beforeDate;

// MARK: Type

export const isBoolean  = function (options?: any) {
  return validatorFactory(validators.isBoolean, [], {
    message: '$field must be a boolean value',
    ...options,
  });
};

export const IsBoolean = isBoolean;

export const isDate  = function (options?: any) {
  return validatorFactory(validators.isDate, [], {
    message: '$field must be a date value',
    ...options,
  });
};

export const IsDate = isDate;

export const isString  = function (options?: any) {
  return validatorFactory(validators.isString, [], {
    message: '$field must be a string value',
    ...options,
  });
};

export const IsString = isString;

export const isNumber  = function (options?: any) {
  return validatorFactory(validators.isNumber, [], {
    message: '$field must be a number value',
    ...options,
  });
};

export const IsNumber = isNumber;

export const isArray  = function (options?: any) {
  return validatorFactory(validators.isArray, [], {
    message: '$field must be a array value',
    ...options,
  });
};

export const IsArray = isArray;

export const isError  = function (options?: any) {
  return validatorFactory(validators.isError, [], {
    message: '$field must be an error',
    ...options,
  });
};

export const IsError = isError;

export const isFunction  = function (options?: any) {
  return validatorFactory(validators.isFunction, [], {
    message: '$field must be a function',
    ...options,
  });
};

export const IsFunction = isFunction;

export const isBuffer  = function (options?: any) {
  return validatorFactory(validators.isBuffer, [], {
    message: '$field must be a buffer',
    ...options,
  });
};

export const IsBuffer = isBuffer;

export const isObject  = function (options?: any) {
  return validatorFactory(validators.isObject, [], {
    message: '$field must be an object value',
    ...options,
  });
};

export const IsObject = isObject;

export const isRegExp  = function (options?: any) {
  return validatorFactory(validators.isRegExp, [], {
    message: '$field must be a regexp',
    ...options,
  });
};

export const IsRegExp = isRegExp;

export const isSymbol  = function (options?: any) {
  return validatorFactory(validators.isSymbol, [], {
    message: '$field must be a symbol value',
    ...options,
  });
};

export const IsSymbol = isSymbol;

export const isNullOrUndefined  = function (options?: any) {
  return validatorFactory(validators.isNullOrUndefined, [], {
    message: '$field must be null or undefined',
    ...options,
  });
};

export const IsNullOrUndefined = isNullOrUndefined;

export const isNull  = function (options?: any) {
  return validatorFactory(validators.isNull, [], {
    message: '$field must be null',
    ...options,
  });
};

export const IsNull = isNull;

export const isUndefined  = function (options?: any) {
  return validatorFactory(validators.isUndefined, [], {
    message: '$field must be undefined',
    ...options,
  });
};

export const IsUndefined = isUndefined;

// MARK: String Type

export const isDateString  = function (options?: any) {
  return validatorFactory(validators.isDateString, [], {
    message: '$field must be a date string value',
    ...options,
  });
};

export const IsDateString = isDateString;

export const isBooleanString  = function (options?: any) {
  return validatorFactory(validators.isBooleanString, [], {
    message: '$field must be a boolean string value',
    ...options,
  });
};

export const IsBooleanString = isBooleanString;

export const isNumberString  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isNumberString, _options, {
    message: '$field must be a number string value',
    ...options,
  });
};

export const IsNumberString = isNumberString;

// MARK: String

export const contains = function (seed: any, options?: any) {
  return validatorFactory(validators.contains, [seed], {
    message: '$field must contain a $1 string',
    ...options,
  });
};

export const Contains = contains;

export const notContains = function (seed: any, options?: any) {
  return validatorFactory(validators.notContains, [seed], {
    message: '$field should not contain a $1 string',
    ...options,
  });
};

export const NotContains = notContains;

export const isAlpha = function (locale?: any, options?: any) {
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

export const IsAlpha = isAlpha;

export const isAlphanumeric = function (locale?: any, options?: any) {
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

export const IsAlphanumeric = isAlphanumeric;

export const isAscii  = function (options?: any) {
  return validatorFactory(validators.isAscii, [], {
    message: '$field must contain only ASCII characters',
    ...options,
  });
};

export const IsAscii = isAscii;

export const isBase64  = function (options?: any) {
  return validatorFactory(validators.isBase64, [], {
    message: '$field must be base64 encoded',
    ...options,
  });
};

export const IsBase64 = isBase64;

export const isByteLength = function (min: any, max: any, options?: any) {
  return validatorFactory(validators.isByteLength, [min, max], {
    message: '$field\'s byte length must fall into($1, $2) range',
    ...options,
  });
};

export const IsByteLength = isByteLength;

export const isCreditCard  = function (options?: any) {
  return validatorFactory(validators.isCreditCard, [], {
    message: '$field must be a credit card',
    ...options,
  });
};

export const IsCreditCard = isCreditCard;

export const isCurrency  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isCurrency, _options, {
    message: '$field must be a currency',
    ...options,
  });
};

export const IsCurrency = isCurrency;

export const isEmail  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isEmail, _options, {
    message: '$field must be an email',
    ...options,
  });
};

export const IsEmail = isEmail;

export const isFQDN  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isFQDN, _options, {
    message: '$field must be a valid domain name',
    ...options,
  });
};

export const IsFQDN = isFQDN;

export const isFullWidth  = function (options?: any) {
  return validatorFactory(validators.isFullWidth, [], {
    message: '$field must contain a full-width characters',
    ...options,
  });
};

export const IsFullWidth = isFullWidth;

export const isHalfWidth  = function (options?: any) {
  return validatorFactory(validators.isHalfWidth, [], {
    message: '$field must contain a half-width characters',
    ...options,
  });
};

export const IsHalfWidth = isHalfWidth;

export const isHexColor  = function (options?: any) {
  return validatorFactory(validators.isHexColor, [], {
    message: '$field must be a hex color',
    ...options,
  });
};

export const IsHexColor = isHexColor;

export const isHexadecimal  = function (options?: any) {
  return validatorFactory(validators.isHexadecimal, [], {
    message: '$field must be a hexadecimal number',
    ...options,
  });
};

export const IsHexadecimal = isHexadecimal;

export const isIP = function (version?: any, options?: any) {
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

export const IsIP = isIP;

export const isISBN = function (version?: any, options?: any) {
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

export const IsISBN = isISBN;

export const isISSN  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isISSN, _options, {
    message: '$field must be an ISSN',
    ...options,
  });
};

export const IsISSN = isISSN;

export const isISIN  = function (options?: any) {
  return validatorFactory(validators.isISIN, [], {
    message: '$field must be an ISIN (stock/security identifier)',
    ...options,
  });
};

export const IsISIN = isISIN;

export const isISO8601  = function (options?: any) {
  return validatorFactory(validators.isISO8601, [], {
    message: '$field must be a valid ISO 8601 date string',
    ...options,
  });
};

export const IsISO8601 = isISO8601;

export const isJSON  = function (options?: any) {
  return validatorFactory(validators.isJSON, [], {
    message: '$field must be a json string',
    ...options,
  });
};

export const IsJSON = isJSON;

export const isLowercase  = function (options?: any) {
  return validatorFactory(validators.isLowercase, [], {
    message: '$field must be a lowercase string',
    ...options,
  });
};

export const IsLowercase = isLowercase;

export const isMobilePhone = function (locale?: any, options?: any) {
  if (locale && typeof locale === 'object') {
    return validatorFactory(validators.isMobilePhone, [locale.locale, locale], locale);
  }
  return validatorFactory(validators.isMobilePhone, [locale, options], {
    message: '$field must be a mobile phone number',
    ...options,
  });
};

export const IsMobilePhone = isMobilePhone;

export const isMongoId  = function (options?: any) {
  return validatorFactory(validators.isMongoId, [], {
    message: '$field must be a mongodb id',
    ...options,
  });
};

export const IsMongoId = isMongoId;

export const isMultibyte  = function (options?: any) {
  return validatorFactory(validators.isMultibyte, [], {
    message: '$field must contain one or more multibyte chars',
    ...options,
  });
};

export const IsMultibyte = isMultibyte;

export const isSurrogatePair  = function (options?: any) {
  return validatorFactory(validators.isSurrogatePair, [], {
    message: '$field must contain any surrogate pairs chars',
    ...options,
  });
};

export const IsSurrogatePair = isSurrogatePair;

export const isURL  = function (options?: any) {
  const _options = options ? [options] : [];
  return validatorFactory(validators.isURL, _options, {
    message: '$field must be an URL address',
    ...options,
  });
};

export const IsURL = isURL;

export const isUUID = function (version?: any, options?: any) {
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

export const IsUUID = isUUID;

export const isUppercase  = function (options?: any) {
  return validatorFactory(validators.isUppercase, [], {
    message: '$field must be an uppercase string',
    ...options,
  });
};

export const IsUppercase = isUppercase;

export const length = function (min: any, max: any, options?: any) {
  return validatorFactory(validators.length, [min, max], {
    message: '$field must be between $1 and $2',
    ...options,
  });
};

export const Length = length;

export const minLength = function (min: any, options?: any) {
  return validatorFactory(validators.minLength, [min], {
    message: '$field must not be shorter than $1',
    ...options,
  });
};

export const MinLength = minLength;

export const maxLength = function (max: any, options?: any) {
  return validatorFactory(validators.maxLength, [max], {
    message: '$field must not be longer than $1',
    ...options,
  });
};

export const MaxLength = maxLength;

export const matches = function (pattern: any, modifiers?: any, options?: any) {
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

export const Matches = matches;
