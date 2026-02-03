"use strict";
const person1 = {
    firstName: "Nathan ",
    lastName: "Drake",
    id: 1
};
function plotPersonInformation(person) {
    `Personne: ${person1.firstName} ${person1.lastName} (id: ${person1.id})`;
}
console.log(plotPersonInformation(person1));
function plotAllPersons(persons) {
    for (const p of persons) {
        plotPersonInformation(p);
    }
    return persons.length;
}
const allPersons = [person1];
const count1 = plotAllPersons(allPersons);
console.log(`Nombre de personnes affichées : ${count1}`);
const person2 = {
    firstName: "Elena",
    lastName: "Fisher",
    id: 2
};
allPersons.push(person2);
const count2 = plotAllPersons(allPersons);
console.log(`Nombre de personnes affichées : ${count2}`);
function findPerson(persons, idToFind) {
    for (const p of persons) {
        if (p.id === idToFind) {
            return p;
        }
    }
    return undefined;
}
const found = findPerson(allPersons, 1);
console.log("Recherche id 1:", found);
const notFound = findPerson(allPersons, 4);
console.log("Recherche id 4:", notFound);
