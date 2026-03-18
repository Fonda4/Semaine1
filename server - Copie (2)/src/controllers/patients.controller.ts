import { Request, Response, Router } from "express";
import { Patient, NewPatient, PatientDTO, ShortPatientDTO, NewPatientDTO, PatientFilter } from "../models/patient.model";
import { PatientsMapper } from "../mappers/patients.mapper";
import { isNiss, isNumber, isString, isNewPatient, isPatient } from "../utils/guards";
import { LoggerService } from "../services/logger.service";
import { PatientsService } from "../services/patients.service";
import { AuthService } from "../services/auth.service";

export const patientsController = Router();
LoggerService.debug("OK Patients");


/**
 * GET /patients/
 */
patientsController.get("/", AuthService.authorize, (req: Request, res: Response) => {
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

  if (!isNewPatient(newPatientDTO)) {
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
