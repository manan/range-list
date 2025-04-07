import { expect } from 'chai';
import { RangeList } from './RangeList.js';

describe('RangeList', () => {
  let rangeList;

  beforeEach(() => {
    rangeList = new RangeList();
  });

  describe('add', () => {
    it('should add intensity to an empty range', () => {
      rangeList.add(10, 30, 1);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [30, 0],
      ]);
    });

    it('should handle overlapping ranges correctly', () => {
      rangeList.add(10, 30, 1);
      rangeList.add(20, 40, 1);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [20, 2],
        [30, 1],
        [40, 0],
      ]);
    });

    it('should handle negative intensity correctly', () => {
      rangeList.add(10, 30, 1);
      rangeList.add(20, 40, 1);
      rangeList.add(10, 40, -2);
      expect(rangeList.toArray()).to.deep.equal([
        [10, -1],
        [20, 0],
        [30, -1],
        [40, 0],
      ]);
    });

    it('should handle multiple operations with partial cancellations', () => {
      rangeList.add(10, 30, 1);
      rangeList.add(20, 40, 1);
      rangeList.add(10, 40, -1);
      expect(rangeList.toArray()).to.deep.equal([
        [20, 1],
        [30, 0],
      ]);
    });

    it('should ignore empty ranges', () => {
      rangeList.add(10, 10, 5);
      expect(rangeList.toArray()).to.deep.equal([]);
    });

    it('should ignore zero intensity changes', () => {
      rangeList.add(10, 20, 0);
      expect(rangeList.toArray()).to.deep.equal([]);
    });

    it('should merge adjacent segments with the same intensity', () => {
      rangeList.add(10, 20, 5);
      rangeList.add(20, 30, 5);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 5],
        [30, 0],
      ]);
    });

    it('should handle complex overlapping operations', () => {
      rangeList.add(10, 50, 1);
      rangeList.add(20, 40, 2);
      rangeList.add(30, 35, -5);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [20, 3],
        [30, -2],
        [35, 3],
        [40, 1],
        [50, 0],
      ]);
    });
  });

  describe('set', () => {
    it('should set intensity for a specific range', () => {
      rangeList.add(10, 50, 1);
      rangeList.set(20, 40, 5);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [20, 5],
        [40, 1],
        [50, 0],
      ]);
    });

    it('should replace all intensities within the range', () => {
      rangeList.add(10, 50, 1);
      rangeList.add(20, 40, 2);
      rangeList.add(30, 35, 3);
      rangeList.set(25, 45, 0);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [20, 3],
        [25, 0],
        [45, 1],
        [50, 0],
      ]);
    });

    it('should handle empty ranges', () => {
      rangeList.add(10, 50, 1);
      rangeList.set(30, 30, 5);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [50, 0],
      ]);
    });

    it('should handle setting intensity at the edges of existing segments', () => {
      rangeList.add(10, 30, 1);
      rangeList.set(10, 20, 5);
      expect(rangeList.toArray()).to.deep.equal([
        [10, 5],
        [20, 1],
        [30, 0],
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle operations that result in zero intensity', () => {
      rangeList.add(10, 30, 5);
      rangeList.add(10, 30, -5);
      expect(rangeList.toArray()).to.deep.equal([]);
    });

    it('should handle large ranges correctly', () => {
      rangeList.add(-1000, 1000, 1);
      rangeList.add(-500, 500, 1);
      rangeList.add(0, 100, 1);
      expect(rangeList.toArray()).to.deep.equal([
        [-1000, 1],
        [-500, 2],
        [0, 3],
        [100, 2],
        [500, 1],
        [1000, 0],
      ]);
    });

    it('should handle ranges with fractional boundaries', () => {
      rangeList.add(10.5, 20.5, 1);
      rangeList.add(15.5, 25.5, 1);
      expect(rangeList.toArray()).to.deep.equal([
        [10.5, 1],
        [15.5, 2],
        [20.5, 1],
        [25.5, 0],
      ]);
    });

    it('should handle negative positions correctly', () => {
      rangeList.add(-30, -10, 1);
      rangeList.add(-20, 0, 1);
      expect(rangeList.toArray()).to.deep.equal([
        [-30, 1],
        [-20, 2],
        [-10, 1],
        [0, 0],
      ]);
    });
  });

  describe('_cleanupRedundantPoints', () => {
    it('should remove redundant points', () => {
      // Directly manipulate the tree to create redundant points
      rangeList.add(10, 30, 1);
      rangeList.add(30, 50, 1); // Creates redundant point at 30

      // Without cleanup, there would be points at [10, 1], [30, 1], [50, 0]
      // With cleanup, it should merge to [10, 1], [50, 0]
      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [50, 0],
      ]);
    });

    it('should handle multiple adjacent points with same intensity', () => {
      rangeList.add(10, 20, 1);
      rangeList.add(20, 30, 1);
      rangeList.add(30, 40, 1);

      expect(rangeList.toArray()).to.deep.equal([
        [10, 1],
        [40, 0],
      ]);
    });
  });
});
