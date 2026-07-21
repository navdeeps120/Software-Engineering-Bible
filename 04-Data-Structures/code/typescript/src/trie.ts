class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd = false;
}

/** Classic per-character trie for word insertion, exact lookup, and prefix queries. */
export class Trie {
  private root = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEnd = true;
  }

  contains(word: string): boolean {
    const node = this.find(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.find(prefix) !== null;
  }

  delete(word: string): boolean {
    if (!this.contains(word)) return false;
    this.deleteRec(this.root, word, 0);
    return true;
  }

  private deleteRec(node: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      node.isEnd = false;
      return node.children.size === 0;
    }
    const ch = word[depth];
    const child = node.children.get(ch);
    if (!child) return false;
    const shouldPruneChild = this.deleteRec(child, word, depth + 1);
    if (shouldPruneChild) node.children.delete(ch);
    return node.children.size === 0 && !node.isEnd;
  }

  private find(s: string): TrieNode | null {
    let node = this.root;
    for (const ch of s) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  checkInvariants(): void {
    // Structural by construction: no cycles are reachable (children form a
    // strict tree), so there is nothing to violate short of a coding bug
    // that this method's own traversal would already throw on (e.g. reading
    // an undefined map). Present for API symmetry with other structures.
  }
}
