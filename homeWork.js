import { companies, users } from './data.js';
// 1. Ամբողջական անունների ձևաչափում

// Փոխակերպիր յուրաքանչյուր օգտատիրոջ մեծատառով գրված ամբողջական անվան տող։ Օրինակ՝ "Tony Stark"։

const fullNames = users.map(user => ({
	...user,
	fullName: `${user.name[0].toLocaleUpperCase() + user.name.slice(1)} ${user.surname[0].toLocaleUpperCase() + user.surname.slice(1)}`,
}));
// console.log(fullNames);

// 2. Միայն «cool» օգտատերերը
// Վերադարձրու միայն այն օգտատերերին, որոնց cool դաշտը true է։
const coolUsers = users.filter(user => user.cool);
// console.log(coolUsers);

// 3. Օգտատիրոջ որոնում ըստ ID-ի
// Գտիր այն օգտատիրոջը, որի id-ն հավասար է Input data.

const inputId = 3;

const user = users.find(user => user.id === inputId);

// console.log(user);

// 4. Ընկերության գոյության տարիները
// Ավելացրու years հատկություն (property) յուրաքանչյուր ընկերության մոտ, որը հավասար է end - start-ի։

const withYears = companies.map(company => ({
	...company,
	years: company.end - company.start,
}));
// console.log(withYears);

// 5. Միայն Hardware ընկերությունները
// Վերադարձրու միայն այն ընկերությունները, որոնց category-ն "Hardware" է։
const hardware = companies.filter(company => company.category === 'Hardware');

// console.log(hardware);

// 6. Հեռացրու վերջին ընկերությունը և պահպանիր այն
// Հեռացրու companies զանգվածի վերջին տարրը pop()-ով, պահպանիր այն փոփոխականում, ապա արտածիր հեռացված ընկերության անունը և մնացած ընկերությունների քանակը։
const removed = companies.pop();

// console.log(removed.company);
// console.log(companies.length);

// 7. Ավելացրու 2 օգտատեր, ապա ֆիլտրիր
// Ավելացրու ստորև նշված 2 օգտատերերին users զանգվածին, ապա վերադարձրու բոլոր cool: false օգտատերերի ամբողջական անունները մեծատառերով։

// Ավելացնել՝
// { id: 7, name: "natasha", surname: "romanoff", age: 36, cool: false }
// և
// { id: 8, name: "thor", surname: "odinson", age: 1500, cool: true }

users.push(
	{
		id: 7,
		name: 'natasha',
		surname: 'romanoff',
		age: 36,
		cool: false,
	},
	{
		id: 8,
		name: 'thor',
		surname: 'odinson',
		age: 1500,
		cool: true,
	},
);

const notCoolUsers = users
	.filter(user => !user.cool)
	.map(
		user =>
			`${user.name[0].toUpperCase() + user.name.slice(1)} ${
				user.surname[0].toUpperCase() + user.surname.slice(1)
			}`,
	);
// console.log(notCoolUsers);

// 8. «Cool» օգտատերերի տարիքային կարգավիճակ
// Ֆիլտրիր cool օգտատերերին, ապա map-ով ստեղծիր օբյեկտ, որը պարունակում է fullName (մեծատառ) և status՝ "երիտասարդ" եթե տարիքը 40-ից փոքր է, հակառակ դեպքում՝ "փորձառու"։

// Սկզբնական կոդ
const result = users
	.filter(user => user.cool)
	.map(user => ({
		fullName: `${user.name[0].toUpperCase() + user.name.slice(1)} ${
			user.surname[0].toUpperCase() + user.surname.slice(1)
		}`,
		status: user.age < 40 ? 'երիտասարդ' : 'փորձառու',
	}));

// console.log(result);

// 9. Դինամիկ ցուցակ — ամբողջական խնդիր

// Կատարիր հետևյալ 4 քայլերը հերթականությամբ։

// 9.1. users-ին ավելացրու՝
// { id: 9, name: "wanda", surname: "maximoff", age: 30, cool: true }

users.push({
	id: 9,
	name: 'wanda',
	surname: 'maximoff',
	age: 30,
	cool: true,
});

// 9.2. companies-ից հեռացրու վերջին ընկերությունը

companies.pop();

// 9.3. Ֆիլտրիր cool օգտատերերին, ովքեր 35-ից փոքր են

// 9.4. map-ով ստեղծիր
// "Անուն — [ընկերությունների_քանակ] ընկերություն կա"
// տող (ընկերությունների քանակը pop-ից հետո).

const dynamicList = users
	.filter(user => user.cool && user.age < 35)
	.map(user => `${user.name} — ${companies.length} ընկերություն կա`);

// console.log(dynamicList);

// 10. Տարիքային վարկանիշ՝ հաշվարկված միավորով

// map-ով յուրաքանչյուր օգտատիրոջ ավելացրու score դաշտ հետևյալ բանաձևով՝
// score = cool ? 100 - age : 50 - age

// Ապա sort-ով դասավորիր score-ի նվազող կարգով և վերջնական արդյունքից map-ով ստեղծիր
// "#N — Անուն Ազգանուն (score: X)"
// տողեր, որտեղ N-ը վարկանիշային համարն է (1-ից)։

const ranking = users
	.map(user => ({
		...user,
		score: user.cool ? 100 - user.age : 50 - user.age,
	}))
	.sort((a, b) => b.score - a.score)
	.map(
		(user, index) =>
			`#${index + 1} — ${user.name} ${user.surname} (score: ${user.score})`,
	);

// console.log(ranking);
