
const users = [
    { id: 1, name: "tony", email: "tony", surname: "stark", age: 45, cool: true },
    { id: 2, name: "steve", email: "steve", surname: "strange", age: 40, cool: true },
    { id: 3, name: "bruce", email: "bruce", surname: "banner", age: 35, cool: false },
    { id: 4, name: "steve", email: "steve", surname: "rogers", age: 73, cool: false },
    { id: 5, name: "sia", email: "sia", surname: "yung", age: 33, cool: true },
    { id: 6, name: "mystic", email: "mystic", surname: "man", age: 30, cool: false },
  ];
  
  const companies = [
    { id: 1, company: "Google", category: "Software", start: 1994, end: 2004, isActive: true },
    { id: 2, company: "Synopsys", category: "Hardware", start: 2004, end: 2020, isActive: true },
    { id: 3, company: "Cisco", category: "Hardware", start: 2011, end: 2019, isActive: true },
    { id: 4, company: "Netflix", category: "Media", start: 2014, end: 2021, isActive: false },
    { id: 5, company: "Marvel", category: "Comics", start: 2008, end: 2019, isActive: false },
  ];

  // # Armen solved
// let newcompanies = [];
// // map , filter, find,
//  newcompanies=companies.map(
//     (c)=>{
// if(c.start>=2004){newcompanies.push(c)}
// return newcompanies
// }
// )


// console.log("newcompanies>>>>>>>>", newcompanies);


// # Anna solved
// veradardznel nor zangvac , vortex ka nor dasht fullname , mnacac dashtery nuynutyamb toxnelov

let usersfull = users.map(

    (u)=>{
        return {...u, fullname: `${u.name}  ${u.surname}`
    }}
)

console.log("usersfull>>>>>>>>", usersfull);