/**
 * This file contains all the logic for the doctors controller
 */

import { Request, Response, Router } from "express";
import { DoctorDTO, NewDoctorDTO , Doctor, NewDoctor} from "../models/doctor.model";
import { isNumber, isString, isNewDoctor, isDoctor } from "../utils/guards";
import { DoctorsMapper } from "../mappers/doctors.mapper";

export const doctorsController = Router();

console.log("OK")

// This is a static mock array of doctors
const doctors: DoctorDTO[] = [
  {id:1, firstName: "Jules", lastName: "Valles", speciality: "Cardiologue"}, 
  {id:2, firstName: "Safouane", lastName: "Van Brussels", speciality: "General Practicien"}, 
  {id:3,firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologiste"}
];

/**
 * This function returns all the doctors
 */
doctorsController.get("/", (req: Request, res: Response) => {
  console.log("[GET] /doctors/");
  const doctorsDTO : DoctorDTO[] = doctors;
  res.status(200).json(doctorsDTO);
});

doctorsController.get("/:id", (req: Request, res: Response) => {
  console.log("[GET] /doctors/:id");

  const id = Number(req.params.id);

  if (!isNumber(id)){
    console.log('invalid id');
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
  
  
  res.status(404).send('Doctor not found'); 
});

doctorsController.post("/", (req: Request, res: Response) => {
  console.log("[POST] /doctors/");

  const NewDoctor: NewDoctorDTO = req.body;
  
  if (!isNewDoctor(NewDoctor)) {
    console.log("Données invalides");
    res.status(400).send("Invalid doctor data");
    return; 
  }

  const newDoctor: NewDoctor = DoctorsMapper.fromNewDTO(NewDoctor);
  console.log(doctors.length)
  const doctor: Doctor = {
    id: doctors.length + 1,
    firstName: newDoctor.firstName,
    lastName:newDoctor.lastName,
    speciality: newDoctor.speciality 
  }

  doctors.push(doctor);

  console.log(`Docteur créé : ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);
  res.status(201).json(DoctorsMapper.toDTO(doctor));
});

doctorsController .put("/:id", (req: Request, res : Response) => {
  const updatedDoctorDTO: DoctorDTO = req.body;
  const id = Number(req.params.id);
  if (!isDoctor(updatedDoctorDTO)) {
  return res.status(400).send("Invalid doctor");
  }
  if (!isNumber(id)) {
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
    return res.status(404).send("Doctor not found");
  }
  doctors[doctorIndex] = updatedDoctor;
  res.status(200).send(DoctorsMapper.toDTO(updatedDoctor));
});