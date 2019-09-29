import { Node } from './node'
import { parsePattern} from './helpers'
import { Route } from './route'
import { Request } from '../request'

export class Trie {
  /**
   * route trie cache map
   */
  routes: Map<string, any> = new Map()

  /**
   * add a route
   * @param route
   */
  add(route: Route) {
    for (const method of route.methods) {
      if (!this.routes.has(method)) {
        this.routes.set(method, new Node());
      }
      this.register(this.routes.get(method), route);
    }
  }

  /**
   * register route node
   * @param rootNode 
   * @param route 
   */
  register(rootNode: Node, route: Route) {
    rootNode.insert(route, route.pieces, 0);
  }

  /**
   * match route by request
   * @param request
   */
  match(request: Request) {
    const _method = request.getMethod()
    const _path = request.getPath()
    const rootNode = this.routes.get(_method);
    if (!rootNode) return null;
    const keys = parsePattern(_path);
    const result = rootNode.search(keys, 0);
    if (result) return result.route || null;
    return null;
  }
}
