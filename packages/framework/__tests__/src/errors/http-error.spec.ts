import { HttpError } from '../../../src/errors/http-error';

describe('src/errors/http-error', () => {
  it('http-error', () => {
    const err = new HttpError(500, 'error');
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe(500);
  });
});
