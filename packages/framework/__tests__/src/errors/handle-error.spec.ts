import { ErrorHandler } from '../../../src/errors/handle';
import { HttpError } from '../../../src/errors/http-error';
import { Application } from '../../../src';
import * as path from 'path';

const app = new Application({
  rootPath: path.resolve(__dirname, '../../daze/src')
});

beforeAll(() => app.initialize());

describe('handle error', () => {
  it('report shoud do nothing with http-error', () => {
    const fn = jest.fn();
    const handler = new ErrorHandler(new HttpError());
    app.on('error', fn);
    handler.report();
    expect(fn).not.toBeCalled();
  });

  it ('report should emit app error with other error', () => {
    const fn = jest.fn();
    const handler = new ErrorHandler(new Error());
    app.on('error', fn);
    handler.report();
    expect(fn).toBeCalled();
  });
});