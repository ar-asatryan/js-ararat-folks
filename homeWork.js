// #tusk number 7
let N = 7

let sum = 0;
let sumOfTen = 0;
let count = 0;

for (let i = 1; i <= 999; i++) {
    if(i%N === 0){
        // sum+=i;
        count++;
        if (count===10) {
            sumOfTen+=i
        }

    }
}
// console.log('sum:'+sum)
console.log('count:'+count)
console.log('sumOfTens:'+sumOfTen);



// console.log('result of',0==='0');
// console.log('result of',0=='0');
