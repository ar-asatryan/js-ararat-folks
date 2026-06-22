
const arrStrings = ["Stark", "Strange", "Banner", "Rogers", "Yung"];


// console.log("arrNums: ", arrNums);
// console.log("arrStrings: ", arrStrings);

// let personObject={
//     name: "Tony",
//     age: 45,
//     city: "New York",
//     country: "USA",
//     isMarried: true,
//     hasChildren: false
// }

// console.log("personObject's name : ", personObject.name );

// console.log("personObject's age : ", personObject.age );
// console.log("personObject's city : ", personObject.city );
// console.log("personObject's country : ", personObject.country );
// console.log("personObject's isMarried : ", personObject.isMarried );
// console.log("personObject's hasChildren : ", personObject.hasChildren );




let max = 0;
const arrNums = [13, 2, 78, 0, -7, 59, 65];

function findMax(arrNums){ 
    for(let i=0; i<arrNums.length; i++){
        console.log("arrNums[i] =  ", arrNums[i]);
        if(arrNums[i]>max){
            max=arrNums[i];
        }
    }
    return max;
}

console.log("Max number in arrNums: ", findMax(arrNums));


let arrRandom = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function bubbleSort(arrRandom){
    for(let i=0; i<arrRandom.length; i++){
        for(let j=0; j<arrRandom.length-i-1; j++){
            if(arrRandom[j]>arrRandom[j+1]){
                [arrRandom[j], arrRandom[j+1]] = [arrRandom[j+1], arrRandom[j]];
            }
        }
    }
    return arrRandom;
}

bubbleSort(arrRandom);
