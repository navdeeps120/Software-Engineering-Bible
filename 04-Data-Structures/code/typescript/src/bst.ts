import { DSError } from "./errors.js";

class BSTNode {
  key: number;
  left: BSTNode | null = null;
  right: BSTNode | null = null;
  constructor(key: number) {
    this.key = key;
  }
}

/** Unbalanced binary search tree over integer keys, no duplicates. */
export class BST {
  protected root: BSTNode | null = null;
  protected count = 0;

  insert(key: number): void {
    if (this.contains(key)) return;
    this.root = this.insertNode(this.root, key);
    this.count++;
  }

  protected insertNode(node: BSTNode | null, key: number): BSTNode {
    if (!node) return new BSTNode(key);
    if (key < node.key) node.left = this.insertNode(node.left, key);
    else if (key > node.key) node.right = this.insertNode(node.right, key);
    return node;
  }

  contains(key: number): boolean {
    let node = this.root;
    while (node) {
      if (key === node.key) return true;
      node = key < node.key ? node.left : node.right;
    }
    return false;
  }

  delete(key: number): boolean {
    const [newRoot, deleted] = this.deleteNode(this.root, key);
    this.root = newRoot;
    if (deleted) this.count--;
    return deleted;
  }

  protected deleteNode(node: BSTNode | null, key: number): [BSTNode | null, boolean] {
    if (!node) return [null, false];
    if (key < node.key) {
      const [newLeft, deleted] = this.deleteNode(node.left, key);
      node.left = newLeft;
      return [node, deleted];
    }
    if (key > node.key) {
      const [newRight, deleted] = this.deleteNode(node.right, key);
      node.right = newRight;
      return [node, deleted];
    }
    if (!node.left) return [node.right, true];
    if (!node.right) return [node.left, true];
    let successor = node.right;
    while (successor.left) successor = successor.left;
    node.key = successor.key;
    const [newRight] = this.deleteNode(node.right, successor.key);
    node.right = newRight;
    return [node, true];
  }

  size(): number {
    return this.count;
  }

  inorder(): number[] {
    const out: number[] = [];
    this.inorderRec(this.root, out);
    return out;
  }

  private inorderRec(node: BSTNode | null, out: number[]): void {
    if (!node) return;
    this.inorderRec(node.left, out);
    out.push(node.key);
    this.inorderRec(node.right, out);
  }

  checkInvariants(): void {
    this.checkBstProperty(this.root, -Infinity, Infinity);
    const counted = this.inorder().length;
    if (counted !== this.count) throw new DSError("invalid", "size counter mismatch");
  }

  private checkBstProperty(node: BSTNode | null, lo: number, hi: number): void {
    if (!node) return;
    if (!(node.key > lo && node.key < hi)) throw new DSError("invalid", "BST ordering property violated");
    this.checkBstProperty(node.left, lo, node.key);
    this.checkBstProperty(node.right, node.key, hi);
  }
}
