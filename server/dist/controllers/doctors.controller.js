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
    { id: 3, firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologiste" }
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
    const id = Number(req.params.id);
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
    const NewDoctor = req.body;
    if (!(0, guards_1.isNewDoctor)(NewDoctor)) {
        console.log("Données invalides");
        res.status(400).send("Invalid doctor data");
        return;
    }
    const newDoctor = doctors_mapper_1.DoctorsMapper.fromNewDTO(NewDoctor);
    console.log(doctors.length);
    const doctor = {
        id: doctors.length + 1,
        firstName: newDoctor.firstName,
        lastName: newDoctor.lastName,
        speciality: newDoctor.speciality
    };
    doctors.push(doctor);
    console.log(`Docteur créé : ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);
    res.status(201).json(doctors_mapper_1.DoctorsMapper.toDTO(doctor));
});
exports.doctorsController.put("/:id", (req, res) => {
    const updatedDoctorDTO = req.body;
    const id = Number(req.params.id);
    if (!(0, guards_1.isDoctor)(updatedDoctorDTO)) {
        return res.status(400).send("Invalid doctor");
    }
    if (!(0, guards_1.isNumber)(id)) {
        return res.status(400).send("Invalid number");
    }
    const updatedDoctor = doctors_mapper_1.DoctorsMapper.fromDTO(updatedDoctorDTO);
    let doctorIndex = -1;
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id === updatedDoctor.id) {
            doctorIndex = i;
            break;
        }
    }
    if (doctorIndex === -1) {
        return res.status(404).send("Doctor not found");
    }
    doctors[doctorIndex] = updatedDoctor;
    res.status(200).send(doctors_mapper_1.DoctorsMapper.toDTO(updatedDoctor));
});
