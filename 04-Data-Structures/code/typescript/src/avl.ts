import { DSError } from "./errors.js";

class AVLNode {
  key: number;
  left: AVLNode | null = null;
  right: AVLNode | null = null;
  height = 1;
  constructor(key: number) {
    this.key = key;
  }
}

/** Self-balancing BST maintaining |balance factor| <= 1 at every node via rotations. */
export class AVL {
  private root: AVLNode | null = null;
  private count = 0;

  private h(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  private balanceFactor(node: AVLNode): number {
    return this.h(node.left) - this.h(node.right);
  }

  private updateHeight(node: AVLNode): void {
    node.height = 1 + Math.max(this.h(node.left), this.h(node.right));
  }

  private rotateRight(y: AVLNode): AVLNode {
    const x = y.left as AVLNode;
    y.left = x.right;
    x.right = y;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  private rotateLeft(x: AVLNode): AVLNode {
    const y = x.right as AVLNode;
    x.right = y.left;
    y.left = x;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  private rebalance(node: AVLNode): AVLNode {
    this.updateHeight(node);
    const bf = this.balanceFactor(node);
    if (bf > 1) {
      if (this.balanceFactor(node.left as AVLNode) < 0) node.left = this.rotateLeft(node.left as AVLNode);
      return this.rotateRight(node);
    }
    if (bf < -1) {
      if (this.balanceFactor(node.right as AVLNode) > 0) node.right = this.rotateRight(node.right as AVLNode);
      return this.rotateLeft(node);
    }
    return node;
  }

  insert(key: number): void {
    if (this.contains(key)) return;
    this.root = this.insertNode(this.root, key);
    this.count++;
  }

  private insertNode(node: AVLNode | null, key: number): AVLNode {
    if (!node) return new AVLNode(key);
    if (key < node.key) node.left = this.insertNode(node.left, key);
    else if (key > node.key) node.right = this.insertNode(node.right, key);
    else return node;
    return this.rebalance(node);
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

  private deleteNode(node: AVLNode | null, key: number): [AVLNode | null, boolean] {
    if (!node) return [null, false];
    if (key < node.key) {
      const [newLeft, deleted] = this.deleteNode(node.left, key);
      node.left = newLeft;
      return deleted ? [this.rebalance(node), true] : [node, false];
    }
    if (key > node.key) {
      const [newRight, deleted] = this.deleteNode(node.right, key);
      node.right = newRight;
      return deleted ? [this.rebalance(node), true] : [node, false];
    }
    if (!node.left) return [node.right, true];
    if (!node.right) return [node.left, true];
    let successor = node.right;
    while (successor.left) successor = successor.left;
    node.key = successor.key;
    const [newRight] = this.deleteNode(node.right, successor.key);
    node.right = newRight;
    return [this.rebalance(node), true];
  }

  size(): number {
    return this.count;
  }

  height(): number {
    return this.h(this.root);
  }

  inorder(): number[] {
    const out: number[] = [];
    this.inorderRec(this.root, out);
    return out;
  }

  private inorderRec(node: AVLNode | null, out: number[]): void {
    if (!node) return;
    this.inorderRec(node.left, out);
    out.push(node.key);
    this.inorderRec(node.right, out);
  }

  checkInvariants(): void {
    this.check(this.root);
    const counted = this.inorder().length;
    if (counted !== this.count) throw new DSError("invalid", "size counter mismatch");
  }

  private check(node: AVLNode | null): void {
    if (!node) return;
    this.check(node.left);
    this.check(node.right);
    const bf = this.balanceFactor(node);
    if (bf > 1 || bf < -1) throw new DSError("invalid", "AVL balance factor out of range");
    const expected = 1 + Math.max(this.h(node.left), this.h(node.right));
    if (node.height !== expected) throw new DSError("invalid", "cached height is stale");
  }
}
