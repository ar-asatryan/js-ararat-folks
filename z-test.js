let elderUser;

for (let i = 0; i < Users.length; i++) {
    if (Users[i].age > elderUser.age) {
        elderUser = Users[i];
    }
}

console.log(elderUser);
let Users = [
    {name: 'Jane', age: 21, city: 'Los Angeles', address: {street: '456 Main St', city: 'Los Angeles', state: 'CA', zip: '90001'}},
    {name: 'Jim', age: 22, city: 'Chicago', address: {street: '789 Main St', city: 'Chicago', state: 'IL', zip: '60601'}},
    {name: 'Jill', age: 23, city: 'Houston', address: {street: '101 Main St', city: 'Houston', state: 'TX', zip: '77001'}},
    {name: 'Jack', age: 24, city: 'Miami', address: {street: '123 Main St', city: 'Miami', state: 'FL', zip: '33101'}},
    {name: 'Jill', age: 25, city: 'San Francisco', address: {street: '456 Main St', city: 'San Francisco', state: 'CA', zip: '94101'}},
    {name: 'Jill', age: 26, city: 'Seattle', address: {street: '789 Main St', city: 'Seattle', state: 'WA', zip: '98101'}},
    {name: 'Jill', age: 27, city: 'Boston', address: {street: '101 Main St', city: 'Boston', state: 'MA', zip: '02101'}},
]



const arrNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let User = { 
     name: 'John',
     age: 20, 
     city: 'New York',
     address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001'
     }
}

let User2 = User
let User3 = User
let User4 = User
let User5 = User



// console.log ('name:', User.name);
// console.log ('age:', User.age);
// console.log ('city:', User.city);


// console.log(User);
// console.log(typeof User);

User.name = 'Jane';

User.name = 'Benner';


console.log(User);
console.log(User2);
console.log(User3);
console.log(User4);
console.log(User5);



console.log("users:", users);
console.log("companies:", companies);

//
// Array Methods testing section:

companies.forEach((c) => console.log("Category -", `${c.category}`));
companies.forEach((c) => (c.category = c.company));
console.log("modified companies", companies);

const usersMap = users.map((user) => ({
  id: user.id,
  id2: 20,
  fullname: `${user.name} ${user.surname}`,
}));

console.log(usersMap);

const usersWithNewAge = users.map((user) => ({ ...user, age: user.age + 1 }));
console.log("users with modified age", usersWithNewAge);

const specUser = users.find((u) => u.id > 1);
const myUsers = users.map((h) => h.name);
const filteredUsers = users.filter((h) => h.id > 1);


//   const newUsers = users.map(

//     (user) => ({ name: "dddddddd", age: user.age + 1 })
//   )

//   console.log("new users", newUsers);


const result = companies
.filter(c => c.start > 2010)
.map(c => c.company.toUpperCase());


console.log("result", result);


let someres = companies.filter((comp) => comp.isActive === true);



console.log("someres", someres);