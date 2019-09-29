
import { Node } from './node'

/**
 * match trie node with type
 */
export function isMatchNodeWithType(node: Node, key: string) {
  if (node.key && node.type === 'static') {
    return node.key === key;
  }
  if (node.key && node.type === 'reg') {
    return (new RegExp(node.key).test(key));
  }
  return false;
};

/**
 * parse pattern to array
 */
export function parsePattern(pattern: string) {
  return pattern.split('/').filter(p => p !== '');
};
