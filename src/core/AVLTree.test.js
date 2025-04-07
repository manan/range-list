import { expect } from 'chai';
import { AVLTree } from './AVLTree.js';

describe('AVLTree', () => {
  let tree;

  beforeEach(() => {
    tree = new AVLTree();
  });

  describe('insert', () => {
    it('should insert a node with the correct key-value pair', () => {
      tree.insert(10, 5);
      const node = tree.find(10);
      expect(node).to.not.be.null;
      expect(node.key).to.equal(10);
      expect(node.value).to.equal(5);
    });

    it('should update the value for an existing key', () => {
      tree.insert(10, 5);
      tree.insert(10, 7);
      const node = tree.find(10);
      expect(node.value).to.equal(7);
    });

    it('should maintain tree balance after multiple insertions', () => {
      const keys = [10, 20, 30, 40, 50, 25, 15];
      keys.forEach((key) => tree.insert(key, key));

      // Check if tree is balanced by ensuring each node's balance factor is valid
      const isBalanced = checkTreeBalance(tree.root);
      expect(isBalanced).to.be.true;

      // Verify all keys are still accessible
      keys.forEach((key) => {
        expect(tree.find(key).value).to.equal(key);
      });
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      [10, 5, 15, 3, 7, 13, 17].forEach((key) => tree.insert(key, key));
    });

    it('should remove a leaf node correctly', () => {
      tree.remove(3);
      expect(tree.find(3)).to.be.null;
      expect(checkTreeBalance(tree.root)).to.be.true;
    });

    it('should remove a node with one child correctly', () => {
      tree.remove(5);
      expect(tree.find(5)).to.be.null;
      expect(tree.find(3)).to.not.be.null;
      expect(tree.find(7)).to.not.be.null;
      expect(checkTreeBalance(tree.root)).to.be.true;
    });

    it('should remove a node with two children correctly', () => {
      tree.remove(10); // Root with two children
      expect(tree.find(10)).to.be.null;
      expect(checkTreeBalance(tree.root)).to.be.true;

      // Verify structure remains intact
      expect(tree.find(5)).to.not.be.null;
      expect(tree.find(15)).to.not.be.null;
    });

    it('should handle removing a non-existent node', () => {
      const sizeBefore = countNodes(tree.root);
      tree.remove(100);
      const sizeAfter = countNodes(tree.root);
      expect(sizeAfter).to.equal(sizeBefore);
      expect(checkTreeBalance(tree.root)).to.be.true;
    });
  });

  describe('find and search operations', () => {
    beforeEach(() => {
      [10, 20, 30, 40, 50, 25, 35].forEach((key) => tree.insert(key, key * 10));
    });

    it('should find an exact key match', () => {
      const node = tree.find(30);
      expect(node.key).to.equal(30);
      expect(node.value).to.equal(300);
    });

    it('should return null for a non-existent key', () => {
      expect(tree.find(15)).to.be.null;
    });

    it('should find the largest key less than the given key', () => {
      const node = tree.findLessThan(30);
      expect(node.key).to.equal(25);
    });

    it('should find the smallest key greater than the given key', () => {
      const node = tree.findGreaterThan(30);
      expect(node.key).to.equal(35);
    });

    it('should find the nearest key', () => {
      expect(tree.findNearest(29).key).to.equal(30);
      expect(tree.findNearest(26).key).to.equal(25);
    });

    it('should collect all keys in a range', () => {
      const keys = tree.getKeysInRange(20, 40);
      expect(keys).to.have.members([20, 25, 30, 35, 40]);
    });
  });

  describe('traversal', () => {
    it('should return nodes in ascending key order', () => {
      const keys = [50, 30, 70, 20, 40, 60, 80];
      keys.forEach((key) => tree.insert(key, key));

      const result = tree.inOrderTraversal();
      const resultKeys = result.map((node) => node.key);

      expect(resultKeys).to.deep.equal([20, 30, 40, 50, 60, 70, 80]);
    });
  });
});

// Helper functions for tree validation
function checkTreeBalance(node) {
  if (!node) return true;

  const leftHeight = getHeight(node.left);
  const rightHeight = getHeight(node.right);
  const balanceFactor = Math.abs(leftHeight - rightHeight);

  // Check if this node is balanced and all its children are balanced
  return balanceFactor <= 1 && checkTreeBalance(node.left) && checkTreeBalance(node.right);
}

function getHeight(node) {
  return node ? node.height : 0;
}

function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}
