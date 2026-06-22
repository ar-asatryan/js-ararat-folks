const users = [
    { id: 1, name: "tony", surname: "stark", age: 45, cool: true },
    { id: 2, name: "steve", surname: "strange", age: 40, cool: true },
    { id: 3, name: "bruce", surname: "banner", age: 35, cool: false },
    { id: 4, name: "steve", surname: "rogers", age: 73, cool: false },
    { id: 5, name: "sia", surname: "yung", age: 33, cool: true },
    { id: 6, name: "mystic", surname: "man", age: 30, cool: false },
  ];
  
  


  const Person = {
    name: "James",
    surname: "Smith",
    age: 30,
    city: "New York",
    isMarried: true,
    hasChildren: false,
    address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001"
    },
    greetPerson: function() {
        return `Hello: ${this.name} ${this.surname}, you are living in ${this.city}!`;
    }, 
    logthis: function() {
        console.log("inside person object",this);
    }
}

console.log(Person.greetPerson());
console.log(this);
Person.logthis();














Array.prototype.myMap = function(callback) {
    const result = [];
    for(let i = 0; i < this.length; i++) {
        result.push(callback(this[i]));
    }
    return result;
}

console.log("myMap result>>>>>>>>",users.myMap((user) => user.name));
console.log("myMap result>>>>>>>>",users.myMap((user) => user.name));
  