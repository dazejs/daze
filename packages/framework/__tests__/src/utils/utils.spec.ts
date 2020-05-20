import { Tool } from '../../../src/utils';


exports.defer = function () {
  const result: { [key: string]: any } = {};
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

describe('daze#utils', () => {
  it('should defer', async () => {
    const deferred = Tool.defer();
    deferred.resolve('hello');
    const res = await deferred.promise;
    expect(res).toBe('hello');
  });
});
