"use strict";
/**
 * This file contains all the logic for the doctors controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorsController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const doctors_mapper_1 = require("../mappers/doctors.mapper");
const logger_service_1 = require("../services/logger.service");
const doctors_service_1 = require("../services/doctors.service");
exports.doctorsController = (0, express_1.Router)();
logger_service_1.LoggerService.debug("OK Doctors");
const doctors = [
    { id: 1, firstName: "Jules", lastName: "Valles", speciality: "Cardiologue" },
    { id: 2, firstName: "Safouane", lastName: "Van Brussels", speciality: "General Practicien" },
    { id: 3, firstName: "Paola", lastName: "Sanchez", speciality: "pulmonologiste" }
];
/**
 * GET /doctors/
 */
exports.doctorsController.get("/", (req, res) => {
    logger_service_1.LoggerService.info(`GET /doctors/ - speciality: ${req.query.speciality}`);
    const specialityValue = req.query.speciality;
    const filter = {};
    if (specialityValue !== undefined) {
        if ((0, guards_1.isString)(specialityValue)) {
            filter.speciality = specialityValue;
        }
        else {
            logger_service_1.LoggerService.error(`GET /doctors/ - paramètre speciality invalide`);
            res.status(400).json("invalid value");
            return;
        }
    }
    const doctors = doctors_service_1.DoctorsService.getAll(filter);
    const doctorsDTO = doctors.map(doctor => doctors_mapper_1.DoctorsMapper.toDTO(doctor));
    res.status(200).json(doctorsDTO);
});
exports.doctorsController.get("/:id", (req, res) => {
    logger_service_1.LoggerService.info(`GET /doctors/${req.params.id}`);
    const id = Number(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error(`GET /doctors/${req.params.id} `);
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
    logger_service_1.LoggerService.error(`GET /doctors/${req.params.id} `);
    res.status(404).send('Doctor not found');
});
exports.doctorsController.post("/", (req, res) => {
    logger_service_1.LoggerService.info("POST /doctors/");
    const NewDoctor = req.body;
    if (!(0, guards_1.isNewDoctor)(NewDoctor)) {
        logger_service_1.LoggerService.error("POST /doctors/ ");
        res.status(400).send("Invalid doctor data");
        return;
    }
    const newDoctor = doctors_mapper_1.DoctorsMapper.fromNewDTO(NewDoctor);
    logger_service_1.LoggerService.debug(`POST /doctors/ - Nombre de docteurs avant ajout: ${doctors.length}`);
    const doctor = {
        id: doctors.length + 1,
        firstName: newDoctor.firstName,
        lastName: newDoctor.lastName,
        speciality: newDoctor.speciality
    };
    doctors.push(doctor);
    logger_service_1.LoggerService.info(`POST /doctors/ - Docteur créé : ${doctor.firstName} ${doctor.lastName} (ID: ${doctor.id})`);
    res.status(201).json(doctors_mapper_1.DoctorsMapper.toDTO(doctor));
});
exports.doctorsController.put("/:id", (req, res) => {
    logger_service_1.LoggerService.info(`PUT /doctors/${req.params.id}`);
    const updatedDoctorDTO = req.body;
    const id = Number(req.params.id);
    if (!(0, guards_1.isDoctor)(updatedDoctorDTO)) {
        logger_service_1.LoggerService.error(`PUT /doctors/${req.params.id} `);
        return res.status(400).send("Invalid doctor");
    }
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error(`PUT /doctors/${req.params.id} `);
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
        logger_service_1.LoggerService.error(`PUT /doctors/${req.params.id} `);
        return res.status(404).send("Doctor not found");
    }
    doctors[doctorIndex] = updatedDoctor;
    logger_service_1.LoggerService.info(`PUT /doctors/${req.params.id} `);
    res.status(200).send(doctors_mapper_1.DoctorsMapper.toDTO(updatedDoctor));
});
exports.doctorsController.delete("/:id", (req, res) => {
    logger_service_1.LoggerService.info(`DELETE /doctors/${req.params.id}`);
    const id = Number(req.params.id);
    let index = -1;
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error(`DELETE /doctors/${req.params.id} `);
        return res.status(400).send("id must be a number");
    }
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id === id) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        logger_service_1.LoggerService.error(`DELETE /doctors/${req.params.id} - Échec : Docteur introuvable`);
        res.status(404).send("Doctor not found");
        return;
    }
    doctors.splice(index, 1);
    logger_service_1.LoggerService.info(`DELETE /doctors/${req.params.id} - Succès : Docteur supprimé`);
    res.status(200).send();
});
