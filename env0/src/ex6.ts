
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


    }
}