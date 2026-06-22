// =============================================================================
// JavaScript fundamentals demo — run with: node demo.js
// (Event loop + process.nextTick require Node.js)
// =============================================================================

console.log("\n=== DATA TYPES ===\n");

// Primitive types: stored by value (copied on assignment)
const num = 42;
const str = "hello";
const bool = true;
const nothing = null;
const notDefined = undefined;
const sym = Symbol("id");
const big = 9007199254740991n;

console.log(typeof num, typeof str, typeof bool);
console.log(typeof nothing, typeof notDefined); // object (historical quirk) | undefined

// Reference type: object (arrays, functions, plain objects share typeof quirks)
const obj = { a: 1 };
const arr = [1, 2, 3];
const fn = function () {};

console.log(typeof obj, Array.isArray(arr), typeof fn); // object | true | function

// Assignment: primitives copy the value
let a = 10;
let b = a;
b = 20;
console.log("primitive copy:", a, b); // 10, 20 — independent

// Assignment: objects copy the reference (same heap object)
const original = { count: 1 };
const alias = original;
alias.count = 99;
console.log("reference share:", original.count, alias.count); // 99, 99

// const prevents rebinding the variable, not mutating object contents
const frozenBinding = { x: 1 };
frozenBinding.x = 2; // OK — mutating property
// frozenBinding = {}; // SyntaxError — cannot reassign const

// let vs var: let is block-scoped; var is function-scoped (see hoisting section)
{
  let blockScoped = "inside block";
  var functionScoped = "leaks to outer function";
}
// console.log(blockScoped); // ReferenceError
console.log("var leaks from block:", functionScoped);

// =============================================================================
console.log("\n=== HOISTING ===\n");

// Function declarations are fully hoisted — callable before the line they appear on
console.log(declaredBeforeLine()); // works

function declaredBeforeLine() {
  return "function declaration was hoisted";
}

// var is hoisted and initialized as undefined until assignment runs
console.log("var before assign:", typeof hoistedVar); // undefined (not ReferenceError)
var hoistedVar = "now assigned";
console.log("var after assign:", hoistedVar);

// let/const are hoisted but live in "temporal dead zone" until their line runs
// console.log(hoistedLet); // ReferenceError if uncommented
let hoistedLet = "let after declaration";

// Function expressions are NOT hoisted as callable functions — only the variable name
console.log("expr type before:", typeof notHoistedExpr); // undefined (var) or TDZ (let)
var notHoistedExpr = function () {
  return "assigned later";
};

// =============================================================================
console.log("\n=== FUNCTION FORMS ===\n");

// Function declaration — named, hoisted, own `this` (depends on call site)
function addDeclaration(a, b) {
  return a + b;
}
console.log("declaration:", addDeclaration(2, 3));

// Function expression — not hoisted as a function; common for callbacks
const multiplyExpression = function (a, b) {
  return a * b;
};
console.log("expression:", multiplyExpression(4, 5));

// Named function expression — name only visible inside the function (debugging)
const divideNamed = function divide(a, b) {
  return a / b;
};
console.log("named expression:", divideNamed(10, 2));

// Arrow function — no own `this`, no `arguments`, concise syntax
const subtractArrow = (a, b) => a - b;
console.log("arrow:", subtractArrow(9, 4));

const objWithMethods = {
  value: 10,
  regular() {
    return this.value;
  },
  arrow: () => {
    // arrow does not bind `this` to objWithMethods
    return typeof this?.value === "undefined" ? "arrow: no instance this" : this.value;
  },
};
console.log("method this:", objWithMethods.regular(), objWithMethods.arrow());

// IIFE — runs immediately; classic pattern before modules
const iifeResult = (function (x) {
  return x * 2;
})(7);
console.log("IIFE:", iifeResult);

// =============================================================================
console.log("\n=== SIMPLE ALGORITHMS ===\n");

// Linear search — O(n)
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
console.log("linearSearch:", linearSearch([3, 1, 4, 1, 5], 4));

// Binary search — O(log n); array must be sorted
function binarySearch(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
console.log("binarySearch:", binarySearch([1, 3, 5, 7, 9], 7));

// Bubble sort — O(n²); educational, not for large data
function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}
console.log("bubbleSort:", bubbleSort([5, 2, 8, 1]));

// Factorial — recursion
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log("factorial(5):", factorial(5));

// Fibonacci — iterative (avoids stack overflow from naive recursion)
function fibonacci(n) {
  if (n <= 1) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}
console.log("fibonacci(10):", fibonacci(10));

// =============================================================================
console.log("\n=== EVENT LOOP (microtasks vs macrotasks) ===\n");

// Synchronous code runs first, in order
console.log("1 sync start");

// Macrotask (task queue) — setTimeout/setInterval run after current stack + microtasks
setTimeout(() => console.log("4 macrotask: setTimeout 0ms"), 0);

// Microtask — Promise callbacks run before the next macrotask
Promise.resolve().then(() => console.log("3 microtask: Promise.then"));

// Another macrotask
setTimeout(() => console.log("6 macrotask: setTimeout second"), 0);

// Microtask chain
Promise.resolve()
  .then(() => console.log("3b microtask: second Promise"))
  .then(() => console.log("3c microtask: chained Promise"));

console.log("2 sync end");

// Order: 1 → 2 → 3 → 3b → 3c → 4 → 6 (timers may interleave if delays differ)

// Nested timers and promises — microtasks drain fully before next macrotask
setTimeout(() => {
  console.log("nested: timeout start");
  Promise.resolve().then(() => console.log("nested: promise inside timeout"));
  console.log("nested: timeout end");
}, 0);

// =============================================================================
console.log("\n=== process.nextTick (Node.js only) ===\n");

if (typeof process !== "undefined" && process.nextTick) {
  // nextTick runs before other microtasks (Promise) — highest priority in Node
  console.log("tick A sync");

  process.nextTick(() => console.log("tick C nextTick"));

  Promise.resolve().then(() => console.log("tick D Promise microtask"));

  setTimeout(() => console.log("tick E setTimeout macrotask"), 0);

  process.nextTick(() => {
    console.log("tick C2 nested nextTick");
    process.nextTick(() => console.log("tick C3 nextTick inside nextTick"));
  });

  console.log("tick B sync end");
  // Typical order: A → B → C → C2 → C3 → D → E
} else {
  console.log("Skip process.nextTick — run with Node.js (node demo.js)");
}

// =============================================================================
console.log("\n=== EVENT LOOP PRACTICE (predict the order) ===\n");

function practiceCase(label, fn) {
  console.log(`--- ${label} ---`);
  fn();
}

practiceCase("Case 1: sync + promise + timeout", () => {
  console.log("a");
  setTimeout(() => console.log("d"), 0);
  Promise.resolve().then(() => console.log("c"));
  console.log("b");
  // Expected: a, b, c, d
});

practiceCase("Case 2: promise inside timeout", () => {
  setTimeout(() => {
    console.log("timeout");
    Promise.resolve().then(() => console.log("promise in timeout"));
  }, 0);
  Promise.resolve().then(() => console.log("promise first"));
  // Expected: promise first → timeout → promise in timeout
});

practiceCase("Case 3: multiple nextTicks vs promise (Node)", () => {
  if (!process?.nextTick) {
    console.log("(Node only)");
    return;
  }
  Promise.resolve().then(() => console.log("p1"));
  process.nextTick(() => console.log("n1"));
  Promise.resolve().then(() => console.log("p2"));
  process.nextTick(() => console.log("n2"));
  // Expected: n1, n2, p1, p2
});

// =============================================================================
// Equality and coercion (often confused with types/assignment)
// =============================================================================
console.log("\n=== == vs === (related to types) ===\n");

console.log(1 == "1", 1 === "1"); // true (coercion) | false (strict)
console.log(null == undefined, null === undefined); // true | false
console.log(Number("42"), Number("not-a-number")); // 42 | NaN

console.log("\n=== Demo complete ===\n");
