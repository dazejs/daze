import { HttpError } from '../../../src/errors/http-error';
import { ValidateHttpError } from '../../../src/errors/validate-http-error';
import { Validate } from '../../../src/validate';

describe('src/errors/validate-error', () => {
  it('validate-error', () => {
    const err = new ValidateHttpError('error', new Validate());
    expect(err).toBeInstanceOf(HttpError);
    expect(err.code).toBe(422);
  });
});
