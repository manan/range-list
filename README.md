# Range List

## Usage

```javascript
const { RangeList } = require('./core/RangeList');

const rangeList = new RangeList();

// Add intensity to ranges
rangeList.add(10, 30, 1);
console.log(rangeList.toArray()); // [[10, 1], [30, 0]]

rangeList.add(20, 40, 1);
console.log(rangeList.toArray()); // [[10, 1], [20, 2], [30, 1], [40, 0]]

// Set intensity for a range
rangeList.set(15, 25, 5);
console.log(rangeList.toArray()); // [[10, 1], [15, 5], [25, 2], [30, 1], [40, 0]]
```

## API

### `add(from, to, amount)`

Adds the specified amount to the intensity in range [from, to).

### `set(from, to, amount)`

Sets the intensity to the specified amount in range [from, to).

### `toArray()`

Returns an array of [position, intensity] pairs representing all segments.

## Tests
<img width="570" alt="Screenshot 2025-04-06 at 8 29 51 PM" src="https://github.com/user-attachments/assets/bf93591d-52ba-4847-860a-419452b5864f" />


## Design & Performance

This implementation uses a self-balancing AVL tree data structure to efficiently track intensity breakpoints, with the following characteristics:

### Runtime Complexity

- **add/set operations**: O(k log n) where n is the total number of breakpoints and k is the number of points affected
- **toArray**: O(n) to traverse all breakpoints

### Design Trade-offs

**AVL Tree vs. Sorted Array**

- **✅ Pro**: O(log n) insertions/deletions instead of O(n)
- **❌ Con**: Higher implementation complexity, slightly worse cache locality

**Redundant Point Cleanup**

- **✅ Pro**: Optimizes storage and improves query performance
- **❌ Con**: Adds computational overhead after modifications

This implementation prioritizes asymptotic efficiency for large datasets and frequent modifications over absolute minimal memory usage.
