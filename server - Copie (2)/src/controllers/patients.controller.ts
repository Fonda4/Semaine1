import { Request, Response, Router } from "express";
import { Patient, NewPatient, PatientDTO, ShortPatientDTO, NewPatientDTO, PatientFilter } from "../models/patient.model";
import { PatientsMapper } from "../mappers/patients.mapper";
import { isNiss, isNumber, isString, isNewPatient, isPatient } from "../utils/guards";
import { LoggerService } from "../services/logger.service";
import { PatientsService } from "../services/patients.service";
import { AuthService } from "../services/auth.service";

export const patientsController = Router();
LoggerService.debug("OK Patients");

LoggerService.info("OK")

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
//   console.log("[GET] /patients/");
//   const patientsDTO : PatientDTO[] = patients;
//   res.status(200).json(patientsDTO);
// });

patientsController.get("/:id", (req: Request, res: Response) => {
    LoggerService.info(`GET /patients/:id - id: ${req.params.id}`);

  const id = Number(req.params.id);

  if (!isNumber(id)){
    LoggerService.error(`Invalid ID: ${id}`);
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

patientsController.get("/niss/:niss", (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/:niss");

  const niss = req.params.niss;

  if (!isNiss(niss)){
    LoggerService.info('invalid niss');
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

  const id = parseInt(req.params.id);

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

  const id = parseInt(req.params.id);
  const zipcode = req.params.zipcode;

  
  if (!isNumber(id) || !isString(zipcode)) {
    LoggerService.error("Invalid parameters");
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

/**
 * GET /patients/:id
 */
patientsController.get("/:id", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info(`[GET] /patients/${req.params.id}`);
  const id = Number(req.params.id);

  if (!isNumber(id)){
    res.status(400).send('ID must be a number');
    return;
  }

  const patient = PatientsService.getById(id);
  
  if (!patient) {
    res.status(404).send('Patient not found');
    return;
  }

  res.status(200).json(PatientsMapper.toDTO(patient));
});

/**
 * GET /patients/:id/short
 */
patientsController.get("/:id/short", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info(`[GET] /patients/${req.params.id}/short`);
  const id = Number(req.params.id);

  if (!isNumber(id)){
    res.status(400).send("L'ID doit être un nombre");
    return;
  }

  const patient = PatientsService.getById(id);
  
  if (!patient) {
    res.status(404).send("Patient non trouvé");
    return;
  }

  res.status(200).json(PatientsMapper.toShortDTO(patient));
});

/**
 * GET/Patient/niss/:niss
 */
patientsController.get("/niss/:niss", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/niss/:niss");
  const niss = req.params.niss;

  if (!isNiss(niss)){
    res.status(400).send("NISS invalide");
    return;
  }

  const patient = PatientsService.getByNiss(niss);
  
  if (patient) {
    res.status(200).json(PatientsMapper.toDTO(patient));
  } else {
    res.status(404).send('Patient not found');
  }
});

/**
 * GET/patient/:id
 */

patientsController.get("/:id/short", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/:id/short");
  const id = Number(req.params.id);

  if (!isNumber(id)){
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

/**
 * GET/patient/:id/zipcode
 */
patientsController.get("/zipcode/:zipcode", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/zipcode/:zipcode");
  const zipcode = req.params.zipcode;

  if (!isString(zipcode)) {
    res.status(400).send('Zipcode must be a string');
    return;
  }

  const patients = PatientsService.getByZipCode(zipcode);
  const results = patients.map(p => PatientsMapper.toDTO(p));
    
  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(404).send('Patient not found');
  }
});


/**
 * GET/doctor/:id/zipcode/:zipcode
 */
patientsController.get("/doctor/:id/zipcode/:zipcode", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info("[GET] /patients/doctor/:id/zipcode/:zipcode");
  const id = Number(req.params.id);
  const zipcode = req.params.zipcode;

  if (!isNumber(id) || !isString(zipcode)) {
    res.status(400).send("Invalid format");
    return;
  }

  const patients = PatientsService.getByZipCode(zipcode);
  const results = patients
    .filter(p => p.refDoctor === id)
    .map(p => PatientsMapper.toDTO(p));

  if (results.length > 0) {
    res.status(200).json(results);
  } else {
    res.status(404).send('Patient not found');
  }
});


/**
 * POST /patients
 */
patientsController.post("/", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info("[POST] /patients/");
  const newPatientDTO: NewPatientDTO = req.body;

  if (!newPatientDTO.firstName || !newPatientDTO.lastName || !newPatientDTO.birthDate) {
    LoggerService.error("POST /patients - Invalid new patient data");
    res.status(400).send("Invalid patient data");
    return;
  }

  const newPatient: NewPatient = PatientsMapper.fromNewDTO(newPatientDTO);
  
  const patientToCreate: Patient = {
    id: 0, 
    firstName: newPatient.firstName,
    lastName: newPatient.lastName,
    birthDate: newPatient.birthDate,
    niss: newPatient.niss,
    address: newPatient.address,
    refDoctor: newPatient.refDoctor
  };

  const createdPatient = PatientsService.create(patientToCreate);

  if (!createdPatient) {
    res.status(422).send("Unprocessable entity : NISS already exists or Doctor not found");
    return;
  }

  res.status(201).json(PatientsMapper.toDTO(createdPatient));
});
/**
 * PUT /patients/:id
 */
patientsController.put("/:id", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info(`[PUT] /patients/${req.params.id}`);
  const id = Number(req.params.id);
  const updatedPatientDTO: PatientDTO = req.body;

  if (!isNumber(id)) {
    LoggerService.error("PUT /patients/:id - Invalid ID parameter");
    res.status(400).send("ID parameter must be a number");
    return;
  }

  if (!isPatient(updatedPatientDTO) || id !== updatedPatientDTO.id) {
    res.status(400).send("Invalid data or Body ID does not match Parameter ID");
    return;
  }

  const patientToUpdate = PatientsMapper.fromDTO(updatedPatientDTO);
  
  const updatedPatient = PatientsService.update(id, patientToUpdate);

  if (!updatedPatient) {
    res.status(404).send("Patient not found or Doctor not found");
    return;
  }

  res.status(200).json(PatientsMapper.toDTO(updatedPatient));
});

/**
 * DELETE /patients/:id
 */
patientsController.delete("/:id", AuthService.authorize, (req: Request, res: Response) => {
  LoggerService.info(`[DELETE] /patients/${req.params.id}`);
  const id = Number(req.params.id);

  if (!isNumber(id)) {
    res.status(400).send("Invalid or missing id");
    return;
  }

  const isDeleted = PatientsService.delete(id);

  if (!isDeleted) {
    res.status(404).send("Patient not found");
    return;
  }

  res.status(200).send();
});
