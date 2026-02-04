import { writePersonJSONFile } from './modules/tools';

const AnOtherPerson: Person = {
firstName: "Jhon ",
lastName: "Doe",
id: 7
}

writePersonJSONFile("person.json",AnOtherPerson)