import { IllegalArgumentError } from '../../../src/errors/illegal-argument-error';

describe('src/errors/illegal-argument-error', () => {
  it('illegal-argument-error', () => {
    const err = new IllegalArgumentError('error');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('error');
  });

  it('should return default message error: Illegal Argument', () => {
    const err = new IllegalArgumentError();
    expect(err.message).toBe('Illegal Argument');
  });
});
