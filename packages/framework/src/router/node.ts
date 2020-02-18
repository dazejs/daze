import { isMatchNodeWithType } from './helpers';
import { Route } from './route';


export class Node {
  /**
   * node key
   */
  key?: string;

  /**
   * node type
   */
  type?: string;

  /**
   * node children
   */
  children: Node[] = []

  /**
   * node route
   */
  route: Route;

  /**
   * node priority
   */
  priority = 0;

  constructor(key?: string, type?: string) {
    /**
     * @type node key: part of request path
     */
    this.key = key;

    /**
     * @type static | reg
     */
    this.type = type;
  }

  /**
   * get first mached route
   * @param key node key
   */
  matchChild(key: string) {
    for (const child of this.children) {
      if (isMatchNodeWithType(child, key)) {
        return child;
      }
    }
    return null;
  }

  /**
   * get all macthed route
   * @param key node key
   */
  matchChildren(key: string) {
    const nodes = [];
    for (const child of this.children) {
      if (isMatchNodeWithType(child, key)) {
        nodes.push(child);
      }
    }
    return nodes;
  }

  /**
   * insert a node with route
   * @param route route instance
   * @param pieces path parts obj: has type and key porps
   * @param height parts index
   */
  insert(route: Route, pieces: any[] = [], height = 0) {
    if (pieces.length === height) {
      this.route = route;
      return;
    }

    const keyObj = pieces[height];

    let child = this.matchChild(keyObj.key);

    if (!child || child.type === 'all') {
      child = new Node(keyObj.key, keyObj.type);
      this.children.push(child);
    }
    child.priority++;
    child.insert(route, pieces, height + 1);
    this.reorderChildren();
  }

  /**
   * reorder children
   */
  reorderChildren() {
    this.children.sort((a, b): number => b.priority - a.priority);
    this.children.sort((_a, b): number => b.type === 'all' ? -1 : 1);
  }

  /**
   * search macthed node
   * @param keys path parts
   * @param height
   */
  search(keys: any[] = [], height = 0): any {
    if (keys.length === height) {
      if (!this.route) return null;
      return this;
    }

    const key = keys[height];
    const children = this.matchChildren(key);

    for (const child of children) {
      if (child.key && child.type === 'all') {
        if (child.route) return child;
      }
      const res = child.search(keys, height + 1);
      if (res) return res;
    }
    return null;
  }
}
