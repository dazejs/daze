import { Node } from './node'
import { parsePattern} from './helpers'

export class Trie {
  routes: Map<string, any>
  constructor() {
    this.routes = new Map();
  }

  add(route: any) {
    for (const method of route.methods) {
      if (!this.routes.has(method)) {
        this.routes.set(method, new Node());
      }
      this.register(this.routes.get(method), route);
    }
  }

  register(rootNode: any, route: any) {
    rootNode.insert(route, route.pieces, 0);
  }

  match(request: any) {
    const { method, path } = request;
    const rootNode = this.routes.get(method);
    if (!rootNode) return null;
    const keys = parsePattern(path);
    const result = rootNode.search(keys, 0);
    if (result) return result.route || null;
    return null;
  }
}
