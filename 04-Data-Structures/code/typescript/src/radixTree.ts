class RadixNode {
  children: Map<string, { label: string; node: RadixNode }> = new Map();
  isEnd = false;
}

/**
 * Compressed trie (radix tree / PATRICIA-style): edges carry whole label
 * strings instead of one node per character, collapsing long unbranching
 * chains. Deletion is intentionally omitted (optional per lab scope).
 */
export class RadixTree {
  private root = new RadixNode();

  insert(word: string): void {
    this.insertRec(this.root, word);
  }

  private insertRec(node: RadixNode, word: string): void {
    if (word.length === 0) {
      node.isEnd = true;
      return;
    }
    const firstChar = word[0];
    const edge = node.children.get(firstChar);
    if (!edge) {
      const leaf = new RadixNode();
      leaf.isEnd = true;
      node.children.set(firstChar, { label: word, node: leaf });
      return;
    }
    const cp = this.commonPrefixLen(edge.label, word);
    if (cp === edge.label.length) {
      this.insertRec(edge.node, word.slice(cp));
      return;
    }
    const splitNode = new RadixNode();
    const oldLabelRest = edge.label.slice(cp);
    splitNode.children.set(oldLabelRest[0], { label: oldLabelRest, node: edge.node });
    const newLabel = edge.label.slice(0, cp);
    node.children.set(firstChar, { label: newLabel, node: splitNode });
    const wordRest = word.slice(cp);
    if (wordRest.length === 0) splitNode.isEnd = true;
    else this.insertRec(splitNode, wordRest);
  }

  private commonPrefixLen(a: string, b: string): number {
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return i;
  }

  contains(word: string): boolean {
    const located = this.locateExact(word);
    return located !== null && located.node.isEnd;
  }

  startsWith(prefix: string): boolean {
    if (prefix.length === 0) return true;
    return this.locatePrefix(this.root, prefix);
  }

  private locatePrefix(node: RadixNode, prefix: string): boolean {
    if (prefix.length === 0) return true;
    const edge = node.children.get(prefix[0]);
    if (!edge) return false;
    const cp = this.commonPrefixLen(edge.label, prefix);
    if (cp === prefix.length) return true;
    if (cp === edge.label.length) return this.locatePrefix(edge.node, prefix.slice(cp));
    return false;
  }

  private locateExact(word: string): { node: RadixNode } | null {
    let node = this.root;
    let remaining = word;
    while (remaining.length > 0) {
      const edge = node.children.get(remaining[0]);
      if (!edge) return null;
      const cp = this.commonPrefixLen(edge.label, remaining);
      if (cp < edge.label.length) return null;
      remaining = remaining.slice(cp);
      node = edge.node;
    }
    return { node };
  }

  checkInvariants(): void {
    // Structural by construction; see Trie.checkInvariants for rationale.
  }
}
