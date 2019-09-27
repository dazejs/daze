
export function createClient() {
  return {
    // @ts-ignore
    get(key: any, cb: any) {
      setTimeout(() => {
        cb(null, '{"test": "aaa"}');
      }, 100);
    },
    // @ts-ignore
    set(key: any, value: any, type: any, max: any, cb: any) {
      setTimeout(() => {
        cb(null, true);
      }, 100);
    },
    // @ts-ignore
    del(key: any, cb: any) {
      setTimeout(() => {
        cb(null, true);
      }, 100);
    },
  };
};
