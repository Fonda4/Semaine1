/**
 * This file contains all the logic for the doctors controller
 */

import { Request, Response, Router } from "express";
import { DoctorDTO, NewDoctorDTO , Doctor, NewDoctor, DoctorFilter} from "../models/doctor.model";
import { isNumber, isString, isNewDoctor, isDoctor } from "../utils/guards";
import { DoctorsMapper } from "../mappers/doctors.mapper";
import { LoggerService } from "../services/logger.service"; 
import { DoctorsService } from "../services/doctors.service";
import { AuthService } from "../services/auth.service"; 

export const doctorsController = Router();

LoggerService.debug("OK Doctors");

const doctors: DoctorDTO[] = [
  {id:1, firstName: "Jules", lastName: "Valles", speciality: "Cardiologue"}, 
  {id:2, firstName: "Safouane", lastName: "Van Brussels", speciality: "General Practicien"}, 
  {id:3,firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologiste"}
];

/**
 * GET /doctors/
 */
doctorsController.get("/", (req: Request, res: Response) => {
  LoggerService.info("[GET] /doctors/");

  const rawSpeciality = req.query.speciality;
  const filter: DoctorFilter = {
    speciality: typeof rawSpeciality === 'string' ? rawSpeciality : undefined
  };

  const doctors = DoctorsService.getAll(filter);
  const doctorsDTO = doctors.map(doctor => DoctorsMapper.toDTO(doctor));

  res.status(200).json(doctorsDTO);
});


doctorsController.get("/:id", (req: Request, res: Response) => {
  LoggerService.info(`GET /doctors/${req.params.id}`);

  const id = Number(req.params.id);

  if (!isNumber(id)){
    LoggerService.error(`GET /doctors/${req.params.id} `);
    res.status(400).send('ID must be a number');
    return;
  }

  for ( let i = 0; i  < doctors.length; i++ ){
    if (doctors[i].id == id){
      const NewDoctorDTO = DoctorsMapper.toDTO(doctors[i]);
      res.status(200).json(NewDoctorDTO);
      return; 
    } 
  }
  
  LoggerService.error(`GET /doctors/${req.params.id} `);
  res.status(404).send('Doctor not found'); 
});


doctorsController.post("/", (req: Request, res: Response) => {
  LoggerService.info("POST /doctors/");

  const NewDoctor: NewDoctorDTO = req.body;
  
  if (!isNewDoctor(NewDoctor)) {
    LoggerService.error("POST /doctors/ ");
    res.status(400).send("Invalid doctor data");
    return; 
  }

  const newDoctor: NewDoctor = DoctorsMapper.fromNewDTO(NewDoctor);
  
  LoggerService.debug(`POST /doctors/ - Nombre de docteurs avant ajout: ${doctors.length}`);
  
  const doctor: Doctor = {
    id: doctors.length + 1,
    firstName: newDoctor.firstName,
    lastName:newDoctor.lastName,
    speciality: newDoctor.speciality 
  }

  doctors.push(doctor);

  LoggerService.info(`POST /doctors/ - Docteur créé : ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);
  res.status(201).json(DoctorsMapper.toDTO(doctor));
});


doctorsController.put("/:id", (req: Request, res : Response) => {
  LoggerService.info(`PUT /doctors/${req.params.id}`);
  
  const updatedDoctorDTO: DoctorDTO = req.body;
  const id = Number(req.params.id);
  
  if (!isDoctor(updatedDoctorDTO)) {
    LoggerService.error(`PUT /doctors/${req.params.id} `);
    return res.status(400).send("Invalid doctor");
  }
  
  if (!isNumber(id)) {
    LoggerService.error(`PUT /doctors/${req.params.id} `);
    return res.status(400).send("Invalid number");
  }

  const updatedDoctor: Doctor = DoctorsMapper.fromDTO(updatedDoctorDTO);
  
  let doctorIndex = -1;

  for ( let i = 0; i<doctors.length ; i++) {
    if (doctors [i]. id === updatedDoctor.id) {
      doctorIndex = i;
      break;
    }
  }
  
  if (doctorIndex === -1) {
    LoggerService.error(`PUT /doctors/${req.params.id} `);
    return res.status(404).send("Doctor not found");
  }
  
  doctors[doctorIndex] = updatedDoctor;
  LoggerService.info(`PUT /doctors/${req.params.id} `);
  res.status(200).send(DoctorsMapper.toDTO(updatedDoctor));
});


doctorsController.delete("/:id", AuthService.authorize, (req: Request, res : Response) => {
  LoggerService.info(`DELETE /doctors/${req.params.id}`);

  const id  = Number(req.params.id);
  let index = -1;

  if(!isNumber(id)){
    LoggerService.error(`DELETE /doctors/${req.params.id} `);
    return res.status(400).send("id must be a number");
  }

  for (let i = 0; i < doctors.length; i++) {
    if (doctors[i].id === id) {
      index = i; 
      break; 
    }
  }

  if (index === -1) {
    LoggerService.error(`DELETE /doctors/${req.params.id} - Échec : Docteur introuvable`);
    res.status(404).send("Doctor not found");
    return;
  }
  
  doctors.splice(index, 1);
  LoggerService.info(`DELETE /doctors/${req.params.id} - Succès : Docteur supprimé`);
  res.status(200).send();
});