
export function createClient() {
  return {
    // eslint-disable-next-line
    // @ts-ignore
    get(key: any, cb: any) {
      setTimeout(() => {
        cb(null, '{"test": "aaa"}');
      }, 100);
    },
    // eslint-disable-next-line
    // @ts-ignore
    set(key: any, value: any, type: any, max: any, cb: any) {
      setTimeout(() => {
        cb(null, true);
      }, 100);
    },
    // eslint-disable-next-line
    // @ts-ignore
    del(key: any, cb: any) {
      setTimeout(() => {
        cb(null, true);
      }, 100);
    },
  };
};
