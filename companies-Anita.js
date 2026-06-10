const companies = [
    { id: 1, company: "Google", category: "Software", start: 1994, end: 2004 , isActive: true},
    { id: 2, company: "Synopsys", category: "Hardware", start: 2004, end: 2020 , isActive: true},
    { id: 3, company: "Cisco", category: "Hardware", start: 2011, end: 2019 , isActive: true},
    { id: 4, company: "Netflix", category: "Media", start: 2014, end: 2021 , isActive: false},
    { id: 5, company: "Marvel", category: "Comics", start: 2008, end: 2019 , isActive: false},
  ];


  //4. Ընկերության գոյության տարիները
  // Ավելացրու years հատկություն (property) յուրաքանչյուր ընկերության մոտ, vory kunena start-end periudy
  
  
//   const withYears = companies.map(/* քո կոդը */);
//   console.log(withYears);

// # Hayk solved.

const Newcompanies = companies.map(
    (company)=>{
        return {
            ...company,
            years: `${company.end }- ${company.start}`,
        }
    }
)
console.log("Newcompanies>>>>>>>>", Newcompanies);