import { AVLTree } from './AVLTree.js';
/**
 * RangeList - Manages intensity values across numeric ranges
 */
export class RangeList {
  constructor() {
    this.tree = new AVLTree();
  }

  /**
   * Add intensity to a specific range
   * @param {number} from - Start of range (inclusive)
   * @param {number} to - End of range (exclusive)
   * @param {number} amount - Intensity amount to add
   */
  add(from, to, amount) {
    if (from >= to || amount === 0) return;

    this._ensurePointExists(from);
    this._ensurePointExists(to);
    this._adjustIntensities(from, to, amount);
    this._cleanupRedundantPoints();
  }

  /**
   * Set intensity for a specific range
   * @param {number} from - Start of range (inclusive)
   * @param {number} to - End of range (exclusive)
   * @param {number} amount - Intensity amount to set
   */
  set(from, to, amount) {
    if (from >= to) return;

    // Get the intensity at the 'to' position before making any changes
    const intensityAfterRange = this._getIntensityAt(to);

    // Ensure boundary points exist
    this._ensurePointExists(from);
    this._ensurePointExists(to);

    // Remove all points within the range
    this._removePointsInRange(from, to);

    // Set intensities at boundaries
    this.tree.update(from, amount);
    this.tree.update(to, intensityAfterRange);

    this._cleanupRedundantPoints();
  }

  /**
   * Ensure a point exists in the tree
   * @param {number} position - Position to ensure exists
   * @private
   */
  _ensurePointExists(position) {
    const node = this.tree.findNearest(position);
    if (!node || node.key !== position) {
      const intensity = this._getIntensityAt(position);
      this.tree.insert(position, intensity);
    }
  }

  /**
   * Get intensity at a specific position
   * @param {number} position - Position to check
   * @returns {number} - The intensity at that position
   * @private
   */
  _getIntensityAt(position) {
    const node = this.tree.findLessThanOrEqual(position);
    return node ? node.value : 0;
  }

  /**
   * Get intensity just before a specific position
   * @param {number} position - Position to check before
   * @returns {number} - The intensity before that position
   * @private
   */
  _getIntensityBefore(position) {
    const node = this.tree.findLessThan(position);
    return node ? node.value : 0;
  }

  /**
   * Adjust intensities within a range by adding an amount
   * @param {number} from - Start of range
   * @param {number} to - End of range
   * @param {number} amount - Amount to add
   * @private
   */
  _adjustIntensities(from, to, amount) {
    const points = this.tree.getKeysInRange(from, to);

    // Adjust intensity for all points in range
    for (const position of points) {
      const node = this.tree.find(position);
      if (node) {
        if (position === from) {
          // For the start point, add amount to all positions after it
          this.tree.update(position, node.value + amount);
        } else if (position < to) {
          // For internal points, just add the amount
          this.tree.update(position, node.value + amount);
        }
      }
    }
  }

  /**
   * Remove all points within a range (exclusive of boundaries)
   * @param {number} from - Start of range
   * @param {number} to - End of range
   * @private
   */
  _removePointsInRange(from, to) {
    const points = this.tree.getKeysInRange(from, to);
    for (const position of points) {
      if (position > from && position < to) {
        this.tree.remove(position);
      }
    }
  }

  /**
   * Remove redundant points (where adjacent segments have same intensity)
   * @private
   */
  _cleanupRedundantPoints() {
    // Convert to array for easier manipulation
    let points = this.tree.inOrderTraversal();
    if (points.length <= 1) return;

    // Identify points to remove
    const toRemove = [];

    // Special case: Remove first point if it has intensity 0 (redundant with default value)
    if (points[0].value === 0) {
      toRemove.push(points[0].key);
    }

    // Go through points to find redundant ones
    for (let i = points.length - 1; i > 0; i--) {
      // If this point has the same intensity as the previous one, it's redundant
      if (points[i].value === points[i - 1].value) {
        toRemove.push(points[i].key);
      }
    }

    // Remove redundant points
    for (const key of toRemove) {
      this.tree.remove(key);
    }
  }

  /**
   * Convert the range list to an array representation
   * @returns {Array} - Array of [position, intensity] pairs
   */
  toArray() {
    return this.tree.inOrderTraversal().map((node) => [node.key, node.value]);
  }
}
