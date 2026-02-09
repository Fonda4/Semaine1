/**
 * This file contains all the logic for the doctors controller
 */

import { Request, Response, Router } from "express";
import { Doctor } from "../models/doctor.model";
import { isNumber } from "../utils/guards";

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

const id = req.params.id;

  if (!isNumber(id)){
    console.log('invalid id');
    res.status(400).send('invalid id');
    return;
  }

  res.status(200).send({});
});
