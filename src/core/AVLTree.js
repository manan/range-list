/**
 * AVLTree - Self-balancing binary search tree
 */
export class AVLTree {
  constructor() {
    this.root = null;
  }

  /**
   * Insert a key-value pair into the tree
   * @param {number} key - The key (position)
   * @param {number} value - The value (intensity)
   */
  insert(key, value) {
    this.root = this._insertNode(this.root, key, value);
  }

  /**
   * Update a node's value
   * @param {number} key - The key to update
   * @param {number} value - The new value
   */
  update(key, value) {
    const node = this.find(key);
    if (node) {
      node.value = value;
    }
  }

  /**
   * Remove a node with the given key
   * @param {number} key - The key to remove
   */
  remove(key) {
    this.root = this._removeNode(this.root, key);
  }

  /**
   * Find a node with the exact key
   * @param {number} key - The key to find
   * @returns {Object|null} - The node or null if not found
   */
  find(key) {
    return this._findNode(this.root, key);
  }

  /**
   * Find the node with the largest key less than the given key
   * @param {number} key - The reference key
   * @returns {Object|null} - The node or null if none exists
   */
  findLessThan(key) {
    return this._findLessThan(this.root, key, null);
  }

  /**
   * Find the node with the largest key less than or equal to the given key
   * @param {number} key - The reference key
   * @returns {Object|null} - The node or null if none exists
   */
  findLessThanOrEqual(key) {
    const exact = this.find(key);
    if (exact) return exact;
    return this.findLessThan(key);
  }

  /**
   * Find the nearest node to the given key
   * @param {number} key - The reference key
   * @returns {Object|null} - The nearest node or null if the tree is empty
   */
  findNearest(key) {
    const exact = this.find(key);
    if (exact) return exact;

    const less = this.findLessThan(key);
    const greater = this.findGreaterThan(key);

    if (!less) return greater;
    if (!greater) return less;

    return key - less.key < greater.key - key ? less : greater;
  }

  /**
   * Find the node with the smallest key greater than the given key
   * @param {number} key - The reference key
   * @returns {Object|null} - The node or null if none exists
   */
  findGreaterThan(key) {
    return this._findGreaterThan(this.root, key, null);
  }

  /**
   * Get all keys within a range (inclusive)
   * @param {number} fromKey - Lower bound
   * @param {number} toKey - Upper bound
   * @returns {Array} - Array of keys in the range
   */
  getKeysInRange(fromKey, toKey) {
    const result = [];
    this._collectKeysInRange(this.root, fromKey, toKey, result);
    return result;
  }

  /**
   * Get all nodes in order of increasing key
   * @returns {Array} - Array of nodes
   */
  inOrderTraversal() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  // Private helper methods for tree operations
  _insertNode(node, key, value) {
    // Perform standard BST insert
    if (!node) return { key, value, height: 1, left: null, right: null };

    if (key < node.key) {
      node.left = this._insertNode(node.left, key, value);
    } else if (key > node.key) {
      node.right = this._insertNode(node.right, key, value);
    } else {
      // Key already exists, update value
      node.value = value;
      return node;
    }

    // Update height and balance the tree
    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    return this._balance(node);
  }

  _removeNode(node, key) {
    if (!node) return null;

    if (key < node.key) {
      node.left = this._removeNode(node.left, key);
    } else if (key > node.key) {
      node.right = this._removeNode(node.right, key);
    } else {
      // Node with the key found
      if (!node.left || !node.right) {
        // Node with one child or no child
        node = node.left || node.right;
      } else {
        // Node with two children
        const successor = this._findMinNode(node.right);
        node.key = successor.key;
        node.value = successor.value;
        node.right = this._removeNode(node.right, successor.key);
      }
    }

    if (!node) return null;

    // Update height and balance the tree
    node.height = 1 + Math.max(this._getHeight(node.left), this._getHeight(node.right));
    return this._balance(node);
  }

  _findNode(node, key) {
    if (!node) return null;
    if (key === node.key) return node;
    return key < node.key ? this._findNode(node.left, key) : this._findNode(node.right, key);
  }

  _findLessThan(node, key, lastLess) {
    if (!node) return lastLess;

    if (node.key >= key) {
      return this._findLessThan(node.left, key, lastLess);
    }

    // Current node key is less than the target key
    // Try to find a better match in the right subtree
    return this._findLessThan(node.right, key, node);
  }

  _findGreaterThan(node, key, lastGreater) {
    if (!node) return lastGreater;

    if (node.key <= key) {
      return this._findGreaterThan(node.right, key, lastGreater);
    }

    // Current node key is greater than the target key
    // Try to find a better match in the left subtree
    return this._findGreaterThan(node.left, key, node);
  }

  _collectKeysInRange(node, fromKey, toKey, result) {
    if (!node) return;

    if (node.key >= fromKey && node.key <= toKey) {
      result.push(node.key);
    }

    if (fromKey < node.key) this._collectKeysInRange(node.left, fromKey, toKey, result);
    if (toKey > node.key) this._collectKeysInRange(node.right, fromKey, toKey, result);
  }

  _inOrder(node, result) {
    if (!node) return;
    this._inOrder(node.left, result);
    result.push({ key: node.key, value: node.value });
    this._inOrder(node.right, result);
  }

  _findMinNode(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  _getHeight(node) {
    return node ? node.height : 0;
  }

  _getBalanceFactor(node) {
    return node ? this._getHeight(node.left) - this._getHeight(node.right) : 0;
  }

  _balance(node) {
    const balanceFactor = this._getBalanceFactor(node);

    // Left heavy
    if (balanceFactor > 1) {
      if (this._getBalanceFactor(node.left) < 0) {
        // Left-Right case
        node.left = this._rotateLeft(node.left);
      }
      // Left-Left case
      return this._rotateRight(node);
    }

    // Right heavy
    if (balanceFactor < -1) {
      if (this._getBalanceFactor(node.right) > 0) {
        // Right-Left case
        node.right = this._rotateRight(node.right);
      }
      // Right-Right case
      return this._rotateLeft(node);
    }

    return node;
  }

  _rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));
    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));

    return x;
  }

  _rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this._getHeight(x.left), this._getHeight(x.right));
    y.height = 1 + Math.max(this._getHeight(y.left), this._getHeight(y.right));

    return y;
  }
}
