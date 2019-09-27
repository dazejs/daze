import { createInjectDecorator } from './factory/create-inject-decorator'
import * as symbols from '../symbol'
export const OriginalReq = createInjectDecorator(symbols.INJECTORS.REQ)
export const Req = OriginalReq
export const OriginalRes = createInjectDecorator(symbols.INJECTORS.RES);
export const Res = OriginalRes
export const Request = createInjectDecorator(symbols.INJECTORS.REQUEST);
export const Response = createInjectDecorator(symbols.INJECTORS.RESPONSE);
export const Query = createInjectDecorator(symbols.INJECTORS.QUERY);
export const Params = createInjectDecorator(symbols.INJECTORS.PARAMS);
export const Header= createInjectDecorator(symbols.INJECTORS.HEADERS);
export const Headers = Header
export const Body = createInjectDecorator(symbols.INJECTORS.BODY);
export const CookieValue = createInjectDecorator(symbols.INJECTORS.COOKIE);
export const SessionValue = createInjectDecorator(symbols.INJECTORS.SESSION);
