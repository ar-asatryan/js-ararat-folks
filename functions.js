// ============================================================
// 1) FUNCTION DECLARATIONS
// ============================================================
// Syntax: function name(params) { ... }
// - Hoisted: can be called BEFORE it is defined in the code.
// - Has its own `this`, `arguments`, can be a constructor (new).

console.log(greet("Tony")); // works even though defined below (hoisting)

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}
console.log("add:", add(2, 3)); // 5

// ============================================================
// 2) FUNCTION EXPRESSIONS
// ============================================================
// A function assigned to a variable.
// - NOT hoisted (the variable is, but value is undefined until this line runs).
// - Can be anonymous or named.

const multiply = function (a, b) {
  return a * b;
};
console.log("multiply:", multiply(4, 5)); // 20

// Named function expression (name is only visible inside the function, useful for recursion/stack traces)
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
console.log("factorial:", factorial(5)); // 120

// Immediately Invoked Function Expression (IIFE) - runs right away
const result = (function () {
  return 10 + 20;
})();
console.log("IIFE result:", result); // 30

// ============================================================
// 3) ARROW FUNCTIONS
// ============================================================
// Shorter syntax. Key differences from normal functions:
// - NO own `this` (inherits `this` from surrounding scope)
// - NO `arguments` object
// - Cannot be used as constructors (no `new`)

// Basic form
const square = (x) => {
  return x * x;
};
console.log("square:", square(6)); // 36

// Implicit return (no braces, no `return` keyword)
const cube = (x) => x * x * x;
console.log("cube:", cube(3)); // 27

// Single parameter: parentheses optional
const double = (x) => x * 2;
console.log("double:", double(8)); // 16

// No parameters: empty parentheses required
const sayHi = () => "Hi!";
console.log("sayHi:", sayHi());

// Returning an object literal: wrap it in parentheses
const makeUser = (name, age) => ({ name, age });
console.log("makeUser:", makeUser("Bruce", 35)); // { name: 'Bruce', age: 35 }

// ============================================================
// 4) `this` DIFFERENCE (most important reason arrows exist)
// ============================================================
const counter = {
  count: 0,
  // Arrow callback keeps `this` pointing to `counter`
  incrementLater() {
    setTimeout(() => {
      this.count++;
      console.log("count is now:", this.count);
    }, 0);
  },
};
counter.incrementLater();

// ============================================================
// 5) PARAMETERS: defaults, rest, destructuring
// ============================================================
// Default parameter
const power = (base, exp = 2) => base ** exp;
console.log("power(5):", power(5)); // 25
console.log("power(2,3):", power(2, 3)); // 8

// Rest parameters (gather all args into an array)
const sumAll = (...nums) => nums.reduce((sum, n) => sum + n, 0);
console.log("sumAll:", sumAll(1, 2, 3, 4, 5)); // 15

// Destructured parameters
const fullName = ({ name, surname }) => `${name} ${surname}`;
console.log("fullName:", fullName({ name: "tony", surname: "stark" }));

// ============================================================
// 6) HIGHER-ORDER FUNCTIONS (functions using functions)
// ============================================================
// Function that takes a function as an argument
const applyTwice = (fn, value) => fn(fn(value));
console.log("applyTwice:", applyTwice((n) => n + 3, 10)); // 16

// Function that returns a function (closure)
const makeMultiplier = (factor) => (n) => n * factor;
const triple = makeMultiplier(3);
console.log("triple:", triple(7)); // 21
