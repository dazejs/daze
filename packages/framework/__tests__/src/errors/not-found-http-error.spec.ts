import { HttpError } from '../../../src/errors/http-error';
import { NotFoundHttpError } from '../../../src/errors/not-found-http-error';

describe('src/errors/not-found-http-error', () => {
  it('not-found-http-error', () => {
    const err = new NotFoundHttpError('error');
    expect(err).toBeInstanceOf(HttpError);
    expect(err.code).toBe(404);
    expect(err.message).toBe('error');
  });

  it('should return default message error: Not Found', () => {
    const err = new NotFoundHttpError();
    expect(err.message).toBe('Not Found');
  });
});
