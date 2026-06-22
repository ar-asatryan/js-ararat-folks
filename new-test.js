


// console.log("users", users);

// console.log("user bruce>>>>>>>>", users[2]);

const newUsers = users.map(
    (user) => ( {
       ...user,
       age: user.age + 1000 } )
)


const infoUsers = users.map(
   (user) => ( {
       info: "user info",
       fullname: `${user.age} years old ${user.surname}`,
   } )
)



const newEmailedUsers = users.map(
   (user) => ( {
      ...user,
      email: user.email + "@gmail.com" } )
)

console.log("newEmailedUsers>>>>>>>>", newEmailedUsers);

console.log("infoUsers>>>>>>>>", infoUsers);



// console.log("infoUsers>>>>>>>>", infoUsers);




// console.log("newUsers>>>>>>>>", newUsers);



let youngUsers = users.filter(
   (user) => user.age < 40
);

console.log("youngUsers>>>>>>>>", youngUsers);

