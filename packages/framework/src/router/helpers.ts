

/**
 * match trie node with type
 */
export function isMatchNodeWithType(node: any, key: string) {
  if (node.type === 'static') {
    return node.key === key;
  }
  if (node.type === 'reg') {
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
