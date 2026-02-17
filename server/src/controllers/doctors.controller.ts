/**
 * This file contains all the logic for the doctors controller
 */

import { Request, Response, Router } from "express";
import { DoctorDTO, NewDoctorDTO , Doctor, NewDoctor} from "../models/doctor.model";
import { isNumber, isString, isNewDoctor } from "../utils/guards";
import { DoctorsMapper } from "../mappers/doctors.mapper";

export const doctorsController = Router();

console.log("OK")

// This is a static mock array of doctors
const doctors: DoctorDTO[] = [
  {id:1, firstName: "Jules", lastName: "Valles", speciality: "Cardiologue"}, 
  {id:2, firstName: "Safouane", lastName: "Van Brussels", speciality: "General Practicien"}, 
  {id:3,firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologist"}
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

  const id = parseInt(req.params.id);

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

  const doctorData = req.body;
  
  if (!isNewDoctor(doctorData)) {
    console.log("Données invalides");
    res.status(400).send("Invalid doctor data: firstName, lastName and speciality are required.");
    return; 
  }

  const newDoctorInfo: NewDoctor = DoctorsMapper.fromNewDTO(doctorData);
  const newId = doctors.length + 1;
  const newDoctor: Doctor = {
    id: newId,
    ...newDoctorInfo 
  };

  doctors.push(newDoctor);

  console.log(`Docteur créé : ${newDoctor.firstName} ${newDoctor.lastName} (ID: ${newDoctor.id})`);
  res.status(201).json(DoctorsMapper.toDTO(newDoctor));
});