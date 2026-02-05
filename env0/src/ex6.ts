
import { table } from 'console';
import { Person } from './person.model';


class Directory {
// code of my class

    private persons : Person[];

    constructor() {
        this.persons = [] ;
    }
    public addPerson ( nom  : Person) : void{
            this.persons.push(nom)
    }



    public getPerson(id: number): Person | undefined {
    // code of my function
    for (let i = 0; i < this.persons.length; i++){
        if (this.persons[i].id ==  id) {
            return this.persons[i];
            }
        }
           return undefined;
    }

    public getAll():Person[] {
        return this.persons;        
    }

  
}

 const myDirectory = new Directory();

 
myDirectory.addPerson ({
firstName :"Nathan ",
lastName: "Drake",
id: 1
})

myDirectory.addPerson ({
firstName :"Jean-Marc ",
lastName: "Genereux",
id: 2
})


console.log(myDirectory.getAll())
console.log(myDirectory.getPerson(1))
console.log(myDirectory.getPerson(1))

 
