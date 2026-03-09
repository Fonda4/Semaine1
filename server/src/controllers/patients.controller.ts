import { Patient, NewPatient, PatientDTO, PatientShortDTO, NewPatientDTO, PatientFilter } from "../models/patient.model";
import { PatientsMapper, } from "../mappers/patients.mapper";
import { Request, Response, Router } from "express";
import { isNiss, isNumber,isString } from "../utils/guards";
import { LoggerService } from "../services/logger.service";
import { PatientsService } from "../services/patients.service";

export const patientsController = Router();

LoggerService.debug("OK Patients")

const patients: PatientDTO[] =[
    { id: 1, firstName: "John", lastName: "Lecarre",birthDate: new Date("1964-05-11"), niss: "640511-123-45",
    address:{ street: "Rue du polar",number: "273-B", zipCode: "1000", city: "Bruxelles", country: "Belgique"},
    refDoctor: 1},
    {id: 2, firstName: "Gabrielle", lastName: "Garcias Marques", birthDate: new Date("1978-12-03"), niss: "781203-123-45",
    address: { street: "Rue du merveilleux", number: "57", zipCode: "1000", city: "Bruxelles", country: "Belgique"},
    refDoctor: 2},
    {id: 3,firstName: "Tintin", lastName: "Reporter", birthDate: new Date("1929-01-10"), niss: "290110-999-88",
    address: { street: "Château de Moulinsart", number: "1", zipCode: "5000", city: "Namur", country: "Belgique" },
    refDoctor: 1
    },
    {id: 4, firstName: "Kamel", lastName: "Kebir",birthDate:new Date("1995-03-03"), niss: "950303-975-31",
    address:{ street:"Karmine Corp",number:"67",zipCode:"9400",city:"Aubervilliers",country:"France"},
  refDoctor:2}
  ];

// patientsController.get("/", (req: Request, res: Response) => {
//   LoggerService.info("[GET] /patients/")
//   const patientsDTO : PatientDTO[] = patients;
//   res.status(200).json(patientsDTO);
// });

patientsController.get("/:id", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/:id");
  const id = Number(req.params.id);

  if (!isNumber(id)){
    LoggerService.error('invalid id');
    res.status(400).send('ID must be a number');
    return;
  }
  const patient = PatientsService.getById(id);
  
  if (patient) {
    res.status(200).json(PatientsMapper.toShortDTO(patient));
  } else {
    res.status(404).send('Patient not found');
  }
});

patientsController.get("/niss/:niss", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/:niss");

  const niss = req.params.niss;

  if (!isNiss(niss)){
    LoggerService.error('invalid niss');
    res.status(400).send("NISS invalide ");
    return;
  }
  
   for ( let i = 0; i  < patients.length; i++ ){
    if (patients[i].niss === niss){
        const PatientDTO = PatientsMapper.toDTO(patients[i]);
      res.status(200).json(PatientDTO);
      return;
    } 
  }

  res.status(404).send('Patient not found');
});

patientsController.get("/:id/short", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patient/:id/short");

  const id = Number(req.params.id);

  if (!isNumber(id)){
    LoggerService.error('invalid id');
    res.status(400).send('ID must be a number');
    return;
  }

  for ( let i = 0; i  < patients.length; i++ ){
    if (patients[i].id == id){
        const PatientDTO = PatientsMapper.toShortDTO(patients[i]);
      res.status(200).json(PatientDTO);        
      return;
    } 
  }
  
  res.status(404).send('Patient not found');
});

patientsController.get("/zipcode/:zipcode", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/zipcode/:zipcode");

  const zipcode = req.params.zipcode;

  if (!isString(zipcode)) {
    LoggerService.error('invalid zipcode format');
    res.status(400).send('Zipcode must be a string');
    return;
  }
  let results: PatientDTO[] = [];

  for (let i = 0; i < patients.length; i++) {
    if (patients[i].address.zipCode === zipcode) {
      results.push(PatientsMapper.toDTO(patients[i]));
    }
  }
    
  if (results.length > 0) {
    res.status(200).json(results);
    return;
  }

  res.status(404).send('Patient not found');
});

patientsController.get("/doctor/:id/zipcode/:zipcode", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/doctor/:id/zipcode/:zipcode");

  const id = Number(req.params.id);
  const zipcode = req.params.zipcode;

  
  if (!isNumber(id) || !isString(zipcode)) {
    LoggerService.error("invalid parameters");
    res.status(400).send("Invalid format");
    return;
  }

  let results: PatientDTO[] = [];

  for (let i = 0; i < patients.length; i++) {    
    if (patients[i].refDoctor === id && patients[i].address.zipCode === zipcode) {
      results.push(PatientsMapper.toDTO(patients[i]));
    }
  }

  if (results.length > 0) {
    res.status(200).json(results);
    return;
  }

  res.status(404).send('Patient not found');
});

patientsController.get("/", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/");

  const rawZipCode = req.query.zipCode;

  const filter: PatientFilter = {
    zipCode: typeof rawZipCode === 'string' ? rawZipCode : undefined
  };

  const patients = PatientsService.getAll(filter);

  const results = patients.map(patient => PatientsMapper.toDTO(patient));

  res.status(200).json(results);
});


patientsController.post("/", (req: Request, res: Response) => {
  LoggerService.info("[POST] /patients/");
  const newPatientDTO: NewPatientDTO = req.body;

  if (!newPatientDTO.firstName || !newPatientDTO.lastName || !newPatientDTO.birthDate) {
    res.status(400).send("Invalid patient data");
    return;
  }

const newPatient = PatientsMapper.fromNewDTO(newPatientDTO);
  
  const patientToCreate: Patient = {
    id: patients.length + 1,
    firstName: newPatient.firstName,
    lastName: newPatient.lastName,
    birthDate: newPatient.birthDate,
    niss: newPatient.niss,
    address: newPatient.address,
    refDoctor: newPatient.refDoctor
  };

  const createdPatient = PatientsService.create(patientToCreate);

  if (createdPatient) {
    res.status(200).json(PatientsMapper.toDTO(createdPatient));
  } else {
    res.status(400).send("Unprocessable entity : NISS already exists or Doctor not found");
  }
});

patientsController.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updatedPatientDTO: PatientDTO = req.body;

  if (!isNumber(id)) {
    res.status(400).send("ID parameter must be a number");
    return;
  }

  if (id !== updatedPatientDTO.id) {
    res.status(400).send("Body ID does not match Parameter ID");
    return;
  }

  let index = -1;
  for (let i = 0; i < patients.length; i++) {
    if (patients[i].id === id) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    res.status(404).send("Patient not found");
    return;
  }

  const updatedPatient = PatientsMapper.fromDTO(updatedPatientDTO);
  patients[index] = updatedPatient;

  res.status(200).json(PatientsMapper.toDTO(patients[index]));
});

patientsController.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!isNumber(id)) {
    res.status(400).send("Invalid or missing id");
    return;
  }

  let index = -1;
  for (let i = 0; i < patients.length; i++) {
    if (patients[i].id === id) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    res.status(404).send("Patient not found");
    return;
  }

  patients.splice(index, 1);
  
  res.status(200).send();
});