import { Provider } from '../../../decorators';
import { app, config } from '../../../helpers';
import { ProxyMiddleware } from '../../buildin-app/middlewares/proxy';
import { Str } from '../../../utils';
import path from 'path';

@Provider()
export class ProxyProvider{

  private fixContext(context: string) {
    return path.join(Str.formatPrefix(config().get('app.baseUrl', '')), context)
      .replace(/^\*$/, "**")
      .replace(/\/\*$/, "");
  }

  launch() {
    let proxyConfig = config().get('proxy', {});
    // For backwards compatibility reasons.
    proxyConfig = Object.keys(proxyConfig).map(context => {
      const correctedContext = this.fixContext(context);
      if (typeof (proxyConfig[context]) === "string") {
        return {
          context: correctedContext,
          target: proxyConfig[context],
          originContext: context
        };
      } else {
        return {
          ...proxyConfig[context],
          context: correctedContext,
          originContext: context,
          only: Array.isArray(proxyConfig[context]?.only) ? 
            proxyConfig[context]?.only.map((uri: string) => this.fixContext(uri)) : 
            undefined,
          except: Array.isArray(proxyConfig[context]?.except) ? 
            proxyConfig[context]?.except.map((uri: string) => this.fixContext(uri)) : 
            undefined,
        };
      }
    });
    for (const context of Object.keys(proxyConfig)) {
      const conf = proxyConfig[context];
      app().use(ProxyMiddleware, [conf]);
    }
  }
}