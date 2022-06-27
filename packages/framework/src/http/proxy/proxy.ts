import Server, { createProxyServer, ServerOptions } from 'http-proxy';
import querystring from 'querystring';
import fs from 'fs';
import { Request } from '../request';
import FD from 'form-data';


/**
 * 代理转发器
 */
export class HttpProxy {
  /**
     * 代理默认参数
     */
  private option: ServerOptions = {
    changeOrigin: true,
    secure: false
  };

  /**
     * proxy Server 实例
     */
  private _server: Server;

  /**
     * 路径重写函数
     */
  private rewriteFn: (path: string) => string;

  /**
     * 构造函数
     * @param option
     */
  constructor(option?: ServerOptions) {
    if (option) this.option = option;
    this._server = createProxyServer();
  }

  on(event: string, listener: () => void): this;
  on(event: "error", listener: Server.ErrorCallback): this;
  on(event: "start", listener: Server.StartCallback): this;
  on(event: "proxyReq", listener: Server.ProxyReqCallback): this;
  on(event: "proxyRes", listener: Server.ProxyResCallback): this;
  on(event: "proxyReqWs", listener: Server.ProxyReqWsCallback): this;
  on(event: "econnreset", listener: Server.EconnresetCallback): this;
  on(event: "end", listener: Server.EndCallback): this;
  on(event: "open", listener: Server.OpenCallback): this;
  on(event: "close", listener: Server.CloseCallback): this;
  on(event: string, listener: any) {
    this._server.on(event, listener);
    return this;
  }

  once(event: string, listener: () => void): this;
  once(event: "error", listener: Server.ErrorCallback): this;
  once(event: "start", listener: Server.StartCallback): this;
  once(event: "proxyReq", listener: Server.ProxyReqCallback): this;
  once(event: "proxyRes", listener: Server.ProxyResCallback): this;
  once(event: "proxyReqWs", listener: Server.ProxyReqWsCallback): this;
  once(event: "econnreset", listener: Server.EconnresetCallback): this;
  once(event: "end", listener: Server.EndCallback): this;
  once(event: "open", listener: Server.OpenCallback): this;
  once(event: "close", listener: Server.CloseCallback): this;
  once(event: string, listener: any) {
    this._server.once(event, listener);
    return this;
  }

  /**
     * 获取 Server 实例
     * @returns
     */
  public getServer() {
    return this._server;
  }

  /**
     * 是否修改 origin，默认 true
     * @param flag
     */
  public changeOrigin(flag = true) {
    this.option.changeOrigin = flag;
    return this;
  }

  /**
     * 是否开启 ws，默认 false
     * @param flag
     */
  public ws(flag = true) {
    this.option.ws = flag;
    return this;
  }

  /**
     * 是否开启 secure，默认 false
     * @param flag
     */
  public secure(flag = true) {
    this.option.ws = flag;
    return this;
  }

  /**
     * 转发目标地址
     * @param target
     */
  public target(target: ServerOptions['target']) {
    this.option.target = target;
    return this;
  }

  /**
     * 路径重写
     * @param fn
     */
  public rewrite(fn: (path: string) => string) {
    this.rewriteFn = fn;
    return this;
  }

  /**
     * 设置额外的 header 头
     * @param headers
     */
  public headers(headers: {[header: string]: string}){
    this.option.headers = {
      ...this.option.headers,
      ...headers
    };
    return this;
  }

  /**
     * 转发
     * @param request
     */
  public output(request: Request): Promise<void> {
    if (typeof this.rewriteFn === 'function') {
      request.url = this.rewriteFn(request.url ?? '') ?? request.url;
    }

    this._server.on('proxyReq', (proxyReq: any, req: any) => {
      const requestBody = req.body;
      const contentType = proxyReq.getHeader('Content-Type');
      if (requestBody) {
        const writeBody = (bodyData: any) => {
          // deepcode ignore ContentLengthInCode: bodyParser fix
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        };
        if (contentType && ~contentType.indexOf('application/json')) {
          writeBody(JSON.stringify(requestBody));
        } else if (contentType && ~contentType.indexOf('application/x-www-form-urlencoded')) {
          writeBody(querystring.stringify(requestBody));
        } else if (contentType && ~contentType.indexOf('multipart/form-data')) {
          const files = req.files;
          const fd = new FD();
          for (const key of Object.keys(files)) {
            fd.append(key, fs.readFileSync(files[key].path), {
              filename: files[key].name,
              contentType: files[key].contentType
            });
          }
          for (const key of Object.keys(requestBody)) {
            fd.append(key, requestBody[key]);
          }
          for (const key of Object.keys(fd.getHeaders())) {
            proxyReq.setHeader(key, fd.getHeaders()[key]);
          }
          const buf = fd.getBuffer();
          proxyReq.setHeader('Content-Length', Buffer.byteLength(buf));
          proxyReq.write(buf);
        } else {
          writeBody(JSON.stringify(requestBody));
        }
      }
    });

    return new Promise((resolve, reject) => {
      this._server.on('end', () => {
        resolve();
      });

      this._server.web(
        request.getReq(),
        request.getRes(),
        this.option,
        (err: Error) => {
          reject(err);
        }
      );
    });
  }
}