
import Stream from 'stream'

export function context(_req?: object, _res?: object) {
  const socket = new Stream.Duplex();
  const req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, _req) as { [key: string]: any};
  const res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, _res) as { [key: string]: any };
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
  return { req, res };
};
``