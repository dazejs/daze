
import Stream from 'stream';
import { IncomingMessage, ServerResponse } from 'http';

export function context(_req?: object, _res?: object) {
  const socket = new Stream.Duplex();
  const req = Object.assign({ headers: {}, socket }, Stream.Readable.prototype, _req) as IncomingMessage;
  const res = Object.assign({ _headers: {}, socket }, Stream.Writable.prototype, _res) as ServerResponse;
  // eslint-disable-next-line
  // @ts-ignore
  req.socket.remoteAddress = req.socket.remoteAddress || '127.0.0.1';
  return { req, res };
};
``;