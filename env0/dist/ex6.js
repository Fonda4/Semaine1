"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Directory {
    constructor() {
        this.persons = [];
    }
    addPerson(nom) {
        this.persons.push(nom);
    }
    getPerson(id) {
        // code of my function
        for (let i = 0; i < this.persons.length; i++) {
            if (this.persons[i].id == id) {
                return this.persons[i];
            }
        }
        return undefined;
    }
    getAll() {
        return this.persons;
    }
}
const myDirectory = new Directory();
myDirectory.addPerson({
    firstName: "Nathan ",
    lastName: "Drake",
    id: 1
});
myDirectory.addPerson({
    firstName: "Jean-Marc ",
    lastName: "Genereux",
    id: 2
});
console.log(myDirectory.getAll());
console.log(myDirectory.getPerson(1));
console.log(myDirectory.getPerson(1));
