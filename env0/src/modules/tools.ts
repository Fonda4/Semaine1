import * as fs from 'fs';
import { Person } from '../person.model';


export function writePersonJSONFile( nom : string, person : Person){

fs.writeFileSync(nom, JSON.stringify(person));
return true;
}