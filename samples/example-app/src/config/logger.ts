
import path from 'path'

export default {
  default: 'console',
  channels: {
    compose: {
      driver: 'compose',
      channels: ['console', 'dailyFile'],
    },
    console: {
      driver: 'console',
    },
    dailyFile: {
      driver: 'dailyFile',
      filename: 'common-%DATE%.log',
      dirname: path.resolve(__dirname, '../../logs'),
    },
  },
};
