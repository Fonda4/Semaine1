/**
 * This file contains all the logic for the doctors controller
 */

import e, { Request, Response, Router } from "express";
import { Doctor } from "../models/doctor.model";
import { isNumber } from "../utils/guards";
import { ElementFlags } from "typescript";

export const doctorsController = Router();

console.log("OK")

// This is a static mock array of doctors
const doctors: Doctor[] = [
  {id:1, firstName: "Jules", lastName: "Valles", speciality: "Cardiologue"}, 
  {id:2, firstName: "Safouane", lastName: "Van Brussels", speciality: "General Practicien"}, 
  {id:3,firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologist"}
];

/**
 * This function returns all the doctors
 */
doctorsController.get("/", (req: Request, res: Response) => {
  console.log("[GET] /doctors/");
  res.json(doctors).status(200);
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
        res.json(doctors[i]).status(200);
        break;
    } 
  }
  
  res.status(404).send('ID must be a correct number');
  return;

});


