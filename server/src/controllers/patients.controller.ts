import { Patient } from "../models/patient.model";
import { Request, Response, Router } from "express";
import { isNiss, isNumber,isString } from "../utils/guards";


export const patientsController = Router();

console.log("OK")

const patients: Patient[] =[
    { id: 1, firstName: "John", lastName: "Lecarre",birthDate: new Date("1964-05-11"), niss: "640511-123-45",
    address:{ street: "Rue du polar",number: "273-B", zipCode: "1000", city: "Bruxelles", country: "Belgique"},
    refDoctor: 1},
    {id: 2, firstName: "Gabrielle", lastName: "Garcias Marques", birthDate: new Date("1978-12-03"), niss: "781203-123-45",
    address: { street: "Rue du merveilleux", number: "57", zipCode: "1000", city: "Bruxelles", country: "Belgique"},
    refDoctor: 2},
    {id: 3,firstName: "Tintin", lastName: "Reporter", birthDate: new Date("1929-01-10"), niss: "290110-999-88",
    address: { street: "Château de Moulinsart", number: "1", zipCode: "5000", city: "Namur", country: "Belgique" },
    refDoctor: 1
    }
  ];

patientsController.get("/", (req: Request, res: Response) => {
  console.log("[GET] /patients/");
  res.json(patients).status(200);
});

patientsController.get("/:id", (req: Request, res: Response) => {
  console.log("[GET] /short/:id");

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


patientsController.get("/niss/:niss", (req: Request, res: Response) => {
  console.log("[GET] /patients/:niss");

const niss = req.params.niss;

  if (!isNiss(niss)){
    console.log('invalid niss');
    res.status(400).send("NISS invalide ");
    return;
  }
  
   for ( let i = 0; i  < patients.length; i++ ){
    if (patients[i].niss === niss){
        res.json(patients[i]).status(200);
        break;
    } 
  }

    res.status(404).send('niss must be real');

})

patientsController.get("/:id/short", (req: Request, res: Response) => {
  console.log("[GET] /patient/:id/short");

const id = parseInt(req.params.id);

  if (!isNumber(id)){
    console.log('invalid id');
    res.status(400).send('ID must be a number');
    return;
  }

  for ( let i = 0; i  < patients.length; i++ ){
    if (patients[i].id == id){
        res.status(200).send('id : '+patients[i].id+'<br> Prénom : '+patients[i].firstName +'<br> Nom : '+ patients[i].lastName);
        break;
    } 
  }
  
  res.status(404).send('ID must be a correct number');
  return;
})

patientsController.get("/zipcode/:zipcode", (req: Request, res: Response) => {
  console.log("[GET] /patients/zipcode/:zipcode");

const zipcode = req.params.zipcode;

  if (!isString(zipcode)) {
    console.log('invalid zipcode format');
    res.status(400).send('Zipcode must be a string');
    return;
  }
let results: Patient[] = [];

  for (let i = 0; i < patients.length; i++) {
    if (patients[i].address.zipCode === zipcode) {
      
      results[results.length] = patients[i];
    }}
  res.status(200).json(results);

  res.status(404).send('ID must be a correct number');
  return;
})

patientsController.get("/doctor/:id/zipcode/:zipcode", (req: Request, res: Response) => {
  console.log("[GET] /patients/doctor/:id/zipcode/:zipcode");

  const id = parseInt(req.params.id);
  const zipcode = req.params.zipcode;

  
  if (!isNumber(id) || !isString(zipcode)) {
    console.log('invalid parameters');
    res.status(400).send('Invalid format: ID must be a number and Zipcode must be a string');
    return;
  }

  let results: Patient[] = [];

  for (let i = 0; i < patients.length; i++) {    
    if (patients[i].refDoctor === id && patients[i].address.zipCode === zipcode) {
      
      results[results.length] = patients[i];
      
    }
  }
  res.status(200).json(results);
});

