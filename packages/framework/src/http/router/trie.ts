import { parsePattern } from './helpers';
import { Node } from './node';
import { Route } from './route';

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
   */
  match(method: string, requestPath: string) {
    const rootNode = this.routes.get(method);
    if (!rootNode) return null;
    const keys = parsePattern(requestPath);
    const result = rootNode.search(keys, 0);
    if (result) return result.route || null;
    return null;
  }
}
