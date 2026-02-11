import { Patient } from "../models/patient.model";
import { Request, Response, Router } from "express";
import { isNiss, isNumber } from "../utils/guards";


export const patientsController = Router();

console.log("OK")

const patients: Patient[] =[
    { id: 1, firstName: "John", lastName: "Lecarre",birthDate: new Date("1964-05-11"), niss: "640511-123-45",
    address:{ street: "Rue du polar",number: "273-B", zipCode: "1000", city: "Bruxelles", country: "Belgique"},
    refDoctor: 1},
    {id: 2, firstName: "Gabrielle", lastName: "Garcias Marques", birthDate: new Date("1978-12-03"), niss: "781203-123-45",
    address: { street: "Rue du merveilleux", number: "57", zipCode: "1000", city: "Bruxelles", country: "Belgique"},
    refDoctor: 2}
    ];

patientsController.get("/", (req: Request, res: Response) => {
  console.log("[GET] /patients/");
  res.json(patients).status(200);
});

patientsController.get("/:id", (req: Request, res: Response) => {
  console.log("[GET] /doctors/:id");


const id = parseInt(req.params.id);

  if (!isNumber(id)){
    console.log('invalid id');
    res.status(400).send('ID must be a number');
    return;
  }

  for ( let i = 0; i  < patients.length; i++ ){
    if (patients[i].id == id){
        res.json(patients[i]).status(200);
        break;
    } 
  }
  
  res.status(404).send('ID must be a correct number');
  return;
 
})

patientsController.get("/:niss", (req: Request, res: Response) => {
  console.log("[GET] /patients/:niss");


const niss = String(req.params.niss);

  if (!isNiss(niss)){
    console.log('invalid id');
    res.status(400).send('ID must be a number');
    return;
  }

  for ( let i = 0; i  < patients.length; i++ ){
    if (patients[i].niss === niss){
        res.json(patients[i]).status(200);
        break;
    } 
  }
  
  res.status(404).send('ID must be a correct number');
  return;
 
})

