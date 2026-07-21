import { DynamicArray } from "./dynamicArray.js";
import { Bitset } from "./bitset.js";
import { RingBuffer } from "./ringBuffer.js";
import { SinglyLinkedList } from "./singlyLinkedList.js";
import { DoublyLinkedList } from "./doublyLinkedList.js";
import { Stack } from "./stack.js";
import { Queue } from "./queue.js";
import { Deque } from "./deque.js";
import { ChainingHashMap, OpenAddressingHashMap } from "./hashMap.js";
import { HashSet } from "./hashSet.js";
import { BST } from "./bst.js";
import { AVL } from "./avl.js";
import { BinaryHeap } from "./binaryHeap.js";
import { IndexedHeap } from "./indexedHeap.js";
import { Trie } from "./trie.js";
import { RadixTree } from "./radixTree.js";
import { AdjListGraph, AdjMatrixGraph } from "./graph.js";
import { UnionFind } from "./unionFind.js";
import { BloomFilter } from "./bloomFilter.js";
import { LRUCache } from "./lruCache.js";
import { PersistentStack } from "./persistentStack.js";
import { MutexMap } from "./mutexMap.js";
import { BoundedConcurrentQueue } from "./boundedConcurrentQueue.js";

export interface VectorOp {
  op: string;
  args?: unknown[];
  expect?: Record<string, unknown>;
  error?: string;
}

export interface VectorDoc {
  name: string;
  structure: string;
  notes?: string;
  ops: VectorOp[];
}

export interface OpResult {
  value?: unknown;
  size?: number;
  list?: unknown[];
  contains?: boolean;
}

interface Adapter {
  apply(op: string, args: unknown[]): OpResult;
  invariants(): void;
}

function unknownOp(structure: string, op: string): never {
  throw new Error(`unknown op '${op}' for structure '${structure}'`);
}

function makeAdapter(structure: string, constructArgs: unknown[]): Adapter {
  switch (structure) {
    case "DynamicArray": {
      const inst = new DynamicArray<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "push":
              inst.push(a[0]);
              return { size: inst.size() };
            case "pop":
              return { value: inst.pop(), size: inst.size() };
            case "get":
              return { value: inst.get(a[0] as number) };
            case "set":
              inst.set(a[0] as number, a[1]);
              return { size: inst.size() };
            case "size":
              return { value: inst.size() };
            case "capacity":
              return { value: inst.capacity() };
            case "toList":
              return { list: inst.toList() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "Bitset": {
      const inst = new Bitset(constructArgs[0] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "set":
              inst.set(a[0] as number, (a[1] as boolean | undefined) ?? true);
              return {};
            case "get":
              return { value: inst.get(a[0] as number) };
            case "count":
              return { value: inst.count() };
            case "toBits":
              return { value: inst.toBits() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "RingBuffer": {
      const inst = new RingBuffer<unknown>(constructArgs[0] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "push":
              inst.push(a[0]);
              return { size: inst.size() };
            case "pop":
              return { value: inst.pop(), size: inst.size() };
            case "size":
              return { value: inst.size() };
            case "isFull": {
              const v = inst.isFull();
              return { value: v, contains: v };
            }
            case "isEmpty": {
              const v = inst.isEmpty();
              return { value: v, contains: v };
            }
            case "toList":
              return { list: inst.toList() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "SinglyLinkedList": {
      const inst = new SinglyLinkedList<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "pushFront":
              inst.pushFront(a[0]);
              return { size: inst.size() };
            case "pushBack":
              inst.pushBack(a[0]);
              return { size: inst.size() };
            case "popFront":
              return { value: inst.popFront(), size: inst.size() };
            case "size":
              return { value: inst.size() };
            case "toList":
              return { list: inst.toList() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "DoublyLinkedList": {
      const inst = new DoublyLinkedList<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "pushFront":
              inst.pushFront(a[0]);
              return { size: inst.size() };
            case "pushBack":
              inst.pushBack(a[0]);
              return { size: inst.size() };
            case "popFront":
              return { value: inst.popFront(), size: inst.size() };
            case "popBack":
              return { value: inst.popBack(), size: inst.size() };
            case "size":
              return { value: inst.size() };
            case "toList":
              return { list: inst.toList() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "Stack": {
      const inst = new Stack<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "push":
              inst.push(a[0]);
              return { size: inst.size() };
            case "pop":
              return { value: inst.pop(), size: inst.size() };
            case "peek":
              return { value: inst.peek() };
            case "size":
              return { value: inst.size() };
            case "isEmpty": {
              const v = inst.isEmpty();
              return { value: v, contains: v };
            }
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "Queue": {
      const inst = new Queue<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "enqueue":
              inst.enqueue(a[0]);
              return { size: inst.size() };
            case "dequeue":
              return { value: inst.dequeue(), size: inst.size() };
            case "peek":
              return { value: inst.peek() };
            case "size":
              return { value: inst.size() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "Deque": {
      const inst = new Deque<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "pushFront":
              inst.pushFront(a[0]);
              return { size: inst.size() };
            case "pushBack":
              inst.pushBack(a[0]);
              return { size: inst.size() };
            case "popFront":
              return { value: inst.popFront(), size: inst.size() };
            case "popBack":
              return { value: inst.popBack(), size: inst.size() };
            case "size":
              return { value: inst.size() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "ChainingHashMap":
    case "OpenAddressingHashMap": {
      const inst = structure === "ChainingHashMap" ? new ChainingHashMap<unknown>() : new OpenAddressingHashMap<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "set":
              inst.set(a[0] as string, a[1]);
              return { size: inst.size() };
            case "get":
              return { value: inst.get(a[0] as string) };
            case "delete": {
              const v = inst.delete(a[0] as string);
              return { value: v, contains: v, size: inst.size() };
            }
            case "has": {
              const v = inst.has(a[0] as string);
              return { value: v, contains: v };
            }
            case "size":
              return { value: inst.size() };
            case "keys":
              return { list: inst.keys() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "HashSet": {
      const inst = new HashSet();
      return {
        apply(op, a) {
          switch (op) {
            case "add":
              inst.add(a[0] as string);
              return { size: inst.size() };
            case "has": {
              const v = inst.has(a[0] as string);
              return { value: v, contains: v };
            }
            case "delete": {
              const v = inst.delete(a[0] as string);
              return { value: v, contains: v, size: inst.size() };
            }
            case "size":
              return { value: inst.size() };
            case "values":
              return { list: inst.values() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "BST":
    case "AVL": {
      const inst = structure === "BST" ? new BST() : new AVL();
      return {
        apply(op, a) {
          switch (op) {
            case "insert":
              inst.insert(a[0] as number);
              return { size: inst.size() };
            case "contains": {
              const v = inst.contains(a[0] as number);
              return { value: v, contains: v };
            }
            case "delete": {
              const v = inst.delete(a[0] as number);
              return { value: v, contains: v, size: inst.size() };
            }
            case "inorder":
              return { list: inst.inorder() };
            case "size":
              return { value: inst.size() };
            case "height":
              if (inst instanceof AVL) return { value: inst.height() };
              return unknownOp(structure, op);
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "BinaryHeap": {
      const inst = new BinaryHeap<number>();
      return {
        apply(op, a) {
          switch (op) {
            case "push":
              inst.push(a[0] as number);
              return { size: inst.size() };
            case "pop":
              return { value: inst.pop(), size: inst.size() };
            case "peek":
              return { value: inst.peek() };
            case "size":
              return { value: inst.size() };
            case "toList":
              return { list: inst.toList() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "IndexedHeap": {
      const inst = new IndexedHeap();
      return {
        apply(op, a) {
          switch (op) {
            case "push":
              inst.push(a[0] as string, a[1] as number);
              return { size: inst.size() };
            case "decreaseKey":
              inst.decreaseKey(a[0] as string, a[1] as number);
              return {};
            case "pop":
              return { value: inst.pop(), size: inst.size() };
            case "contains": {
              const v = inst.contains(a[0] as string);
              return { value: v, contains: v };
            }
            case "size":
              return { value: inst.size() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "Trie":
    case "RadixTree": {
      const inst = structure === "Trie" ? new Trie() : new RadixTree();
      return {
        apply(op, a) {
          switch (op) {
            case "insert":
              inst.insert(a[0] as string);
              return {};
            case "contains": {
              const v = inst.contains(a[0] as string);
              return { value: v, contains: v };
            }
            case "startsWith": {
              const v = inst.startsWith(a[0] as string);
              return { value: v, contains: v };
            }
            case "delete":
              if (inst instanceof Trie) {
                const v = inst.delete(a[0] as string);
                return { value: v, contains: v };
              }
              return unknownOp(structure, op);
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "AdjListGraph": {
      const inst = new AdjListGraph();
      return {
        apply(op, a) {
          switch (op) {
            case "addVertex":
              inst.addVertex(a[0] as string);
              return { size: inst.vertexCount() };
            case "addEdge":
              inst.addEdge(a[0] as string, a[1] as string);
              return { size: inst.edgeCount() };
            case "neighbors":
              return { list: inst.neighbors(a[0] as string) };
            case "vertexCount":
              return { value: inst.vertexCount() };
            case "edgeCount":
              return { value: inst.edgeCount() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "AdjMatrixGraph": {
      const inst = new AdjMatrixGraph(constructArgs[0] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "addVertex":
              return { value: inst.addVertex() };
            case "addEdge":
              inst.addEdge(a[0] as number, a[1] as number);
              return { size: inst.edgeCount() };
            case "neighbors":
              return { list: inst.neighbors(a[0] as number) };
            case "vertexCount":
              return { value: inst.vertexCount() };
            case "edgeCount":
              return { value: inst.edgeCount() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "UnionFind": {
      const inst = new UnionFind(constructArgs[0] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "find":
              return { value: inst.find(a[0] as number) };
            case "union":
              inst.union(a[0] as number, a[1] as number);
              return { value: inst.count() };
            case "connected": {
              const v = inst.connected(a[0] as number, a[1] as number);
              return { value: v, contains: v };
            }
            case "count":
              return { value: inst.count() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "BloomFilter": {
      const inst = new BloomFilter(constructArgs[0] as number, constructArgs[1] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "add":
              inst.add(a[0] as string);
              return {};
            case "mightContain": {
              const v = inst.mightContain(a[0] as string);
              return { value: v, contains: v };
            }
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "LRUCache": {
      const inst = new LRUCache<unknown, unknown>(constructArgs[0] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "get":
              return { value: inst.get(a[0]) };
            case "put":
              inst.put(a[0], a[1]);
              return { size: inst.size() };
            case "size":
              return { value: inst.size() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "PersistentStack": {
      let current = PersistentStack.empty<unknown>();
      const snapshots = new Map<string, PersistentStack<unknown>>();
      return {
        apply(op, a) {
          switch (op) {
            case "push":
              current = current.push(a[0]);
              return { size: current.size() };
            case "pop": {
              const [value, next] = current.pop();
              current = next;
              return { value, size: current.size() };
            }
            case "size":
              return { value: current.size() };
            case "toList":
              return { list: current.toList() };
            case "snapshot":
              snapshots.set(a[0] as string, current);
              return {};
            case "checkSnapshot": {
              const snap = snapshots.get(a[0] as string);
              if (!snap) throw new Error(`no snapshot named '${a[0]}'`);
              return { list: snap.toList() };
            }
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => current.checkInvariants(),
      };
    }
    case "MutexMap": {
      const inst = new MutexMap<unknown>();
      return {
        apply(op, a) {
          switch (op) {
            case "set":
              inst.set(a[0] as string, a[1]);
              return { size: inst.size() };
            case "get":
              return { value: inst.get(a[0] as string) };
            case "delete": {
              const v = inst.delete(a[0] as string);
              return { value: v, contains: v, size: inst.size() };
            }
            case "size":
              return { value: inst.size() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    case "BoundedConcurrentQueue": {
      const inst = new BoundedConcurrentQueue<unknown>(constructArgs[0] as number);
      return {
        apply(op, a) {
          switch (op) {
            case "tryOffer": {
              const v = inst.tryOffer(a[0]);
              return { value: v, contains: v, size: inst.size() };
            }
            case "tryPoll":
              return { value: inst.tryPoll(), size: inst.size() };
            case "size":
              return { value: inst.size() };
            default:
              return unknownOp(structure, op);
          }
        },
        invariants: () => inst.checkInvariants(),
      };
    }
    default:
      throw new Error(`unknown structure '${structure}'`);
  }
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as Record<string, unknown>).sort();
    const bk = Object.keys(b as Record<string, unknown>).sort();
    if (!deepEqual(ak, bk)) return false;
    for (const k of ak) {
      if (!deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
    }
    return true;
  }
  return false;
}

function errorCodeOf(e: unknown): string {
  if (e && typeof e === "object" && "code" in e) return String((e as { code: unknown }).code);
  return e instanceof Error ? e.message : String(e);
}

export function runVector(doc: VectorDoc): void {
  if (!doc.ops || doc.ops.length === 0 || doc.ops[0].op !== "construct") {
    throw new Error(`vector '${doc.name}' must start with a construct op`);
  }
  const adapter = makeAdapter(doc.structure, doc.ops[0].args ?? []);
  for (let i = 1; i < doc.ops.length; i++) {
    const step = doc.ops[i];
    const args = step.args ?? [];
    if (step.error !== undefined) {
      let threw = false;
      let code = "";
      try {
        adapter.apply(step.op, args);
      } catch (e) {
        threw = true;
        code = errorCodeOf(e);
      }
      if (!threw) {
        throw new Error(`${doc.name} step ${i} (${step.op}): expected error '${step.error}' but nothing was thrown`);
      }
      if (code !== step.error) {
        throw new Error(`${doc.name} step ${i} (${step.op}): expected error '${step.error}' but got '${code}'`);
      }
      continue;
    }
    const result = adapter.apply(step.op, args);
    adapter.invariants();
    if (step.expect) {
      for (const key of Object.keys(step.expect)) {
        const actual = (result as Record<string, unknown>)[key];
        const expected = step.expect[key];
        if (!deepEqual(actual, expected)) {
          throw new Error(
            `${doc.name} step ${i} (${step.op}): expected ${key}=${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
          );
        }
      }
    }
  }
}