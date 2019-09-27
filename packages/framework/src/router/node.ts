
import { isMatchNodeWithType } from './helpers'

export class Node {
  key?: string;
  type?: string;
  children: Node[]
  route: any;
  constructor(key?: string, type?: string) {
    /**
     * @type node key: part of request path
     */
    this.key = key;

    /**
     * @type static | reg
     */
    this.type = type;

    /**
     * @type child node alist
     */
    this.children = [];

    /**
     * binded route
     */
    this.route = null;
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
  insert(route: any, pieces: any[] = [], height = 0) {
    if (pieces.length === height) {
      this.route = route;
      return;
    }

    const keyObj = pieces[height];

    let child = this.matchChild(keyObj.key);

    if (!child) {
      child = new Node(keyObj.key, keyObj.type);
      this.children.push(child);
    }
    child.insert(route, pieces, height + 1);
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
      const res = child.search(keys, height + 1);
      if (res) return res;
    }
    return null;
  }
}
