"use strict";
/**
 * This file contains all the logic for the doctors controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorsController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const doctors_mapper_1 = require("../mappers/doctors.mapper");
exports.doctorsController = (0, express_1.Router)();
console.log("OK");
// This is a static mock array of doctors
const doctors = [
    { id: 1, firstName: "Jules", lastName: "Valles", speciality: "Cardiologue" },
    { id: 2, firstName: "Safouane", lastName: "Van Brussels", speciality: "General Practicien" },
    { id: 3, firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologist" }
];
/**
 * This function returns all the doctors
 */
exports.doctorsController.get("/", (req, res) => {
    console.log("[GET] /doctors/");
    const doctorsDTO = doctors;
    res.status(200).json(doctorsDTO);
});
exports.doctorsController.get("/:id", (req, res) => {
    console.log("[GET] /doctors/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        console.log('invalid id');
        res.status(400).send('ID must be a number');
        return;
    }
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id == id) {
            const NewDoctorDTO = doctors_mapper_1.DoctorsMapper.toDTO(doctors[i]);
            res.status(200).json(NewDoctorDTO);
            return;
        }
    }
    res.status(404).send('Doctor not found');
});
exports.doctorsController.post("/", (req, res) => {
    console.log("[POST] /doctors/");
    const doctorData = req.body;
    if (!(0, guards_1.isNewDoctor)(doctorData)) {
        console.log("Données invalides");
        res.status(400).send("Invalid doctor data: firstName, lastName and speciality are required.");
        return;
    }
    const newDoctorInfo = doctors_mapper_1.DoctorsMapper.fromNewDTO(doctorData);
    const newId = doctors.length + 1;
    const newDoctor = Object.assign({ id: newId }, newDoctorInfo);
    doctors.push(newDoctor);
    console.log(`Docteur créé : ${newDoctor.firstName} ${newDoctor.lastName} (ID: ${newDoctor.id})`);
    res.status(201).json(doctors_mapper_1.DoctorsMapper.toDTO(newDoctor));
});
