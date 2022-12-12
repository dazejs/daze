import { Request } from "../../../packages/common/dist";

export default {
    '/xhr/*': {
        target: 'https://baidu.com',
        // only: ['/xhr/set'],
        rewrite: (p: string) => {
            return p.replace('/xhr', '');
        }
    }
};