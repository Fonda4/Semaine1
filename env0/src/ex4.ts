interface Person {
firstName: string,
lastName: string,
id: number
}

const person1: Person = {
firstName: "Nathan ",
lastName: "Drake",
id: 1
}

function plotPersonInformation( person : Person): void{
    `Personne: ${person1.firstName} ${person1.lastName} (id: ${person1.id})`
}
console.log( plotPersonInformation(person1))

function plotAllPersons ( persons ) : 