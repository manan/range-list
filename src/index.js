import { RangeList } from './core/RangeList.js';

(() => {
  // Example 1
  console.log('Example 1:');
  let rangeList = new RangeList();

  rangeList.add(10, 30, 1);
  console.log(rangeList.toArray()); // [[10, 1], [30, 0]]

  rangeList.add(20, 40, 1);
  console.log(rangeList.toArray()); // [[10, 1], [20, 2], [30, 1], [40, 0]]

  rangeList.add(10, 40, -2);
  console.log(rangeList.toArray()); // [[10, -1], [20, 0], [30, -1], [40, 0]]

  // Example 2
  console.log('Example 2:');
  rangeList = new RangeList();

  rangeList.add(10, 30, 1);
  console.log(rangeList.toArray()); // [[10, 1], [30, 0]]

  rangeList.add(20, 40, 1);
  console.log(rangeList.toArray()); // [[10, 1], [20, 2], [30, 1], [40, 0]]

  rangeList.add(10, 40, -1);
  console.log(rangeList.toArray()); // [[20, 1], [30, 0]]

  rangeList.add(10, 40, -1);
  console.log(rangeList.toArray()); // [[10, -1], [20, 0], [30, -1], [40, 0]]
})();
