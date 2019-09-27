import { HttpError } from '../../../src/errors/http-error';
import { ValidateHttpError } from '../../../src/errors/validate-http-error';

describe('src/errors/validate-error', () => {
  it('validate-error', () => {
    const err = new ValidateHttpError('error');
    expect(err).toBeInstanceOf(HttpError);
    expect(err.code).toBe(422);
  });
});
