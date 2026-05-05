"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsController = void 0;
const express_1 = require("express");
const patients_mapper_1 = require("../mappers/patients.mapper");
const guards_1 = require("../utils/guards");
const logger_service_1 = require("../services/logger.service");
const patients_service_1 = require("../services/patients.service");
const auth_service_1 = require("../services/auth.service");
exports.patientsController = (0, express_1.Router)();
logger_service_1.LoggerService.debug("OK Patients");
/**
 * GET /patients/
 */
exports.patientsController.get("/", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[GET] /patients/");
    const rawZipCode = req.query.zipCode;
    const filter = {
        zipCode: typeof rawZipCode === 'string' ? rawZipCode : undefined
    };
    const patients = patients_service_1.PatientsService.getAll(filter);
    const results = patients.map(patient => patients_mapper_1.PatientsMapper.toDTO(patient));
    res.status(200).json(results);
});
/**
 * GET /patients/:id
 */
exports.patientsController.get("/:id", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info(`[GET] /patients/${req.params.id}`);
    const id = Number(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send('ID must be a number');
        return;
    }
    const patient = patients_service_1.PatientsService.getById(id);
    if (!patient) {
        res.status(404).send('Patient not found');
        return;
    }
    res.status(200).json(patients_mapper_1.PatientsMapper.toDTO(patient));
});
/**
 * GET /patients/:id/short
 */
exports.patientsController.get("/:id/short", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info(`[GET] /patients/${req.params.id}/short`);
    const id = Number(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send("L'ID doit être un nombre");
        return;
    }
    const patient = patients_service_1.PatientsService.getById(id);
    if (!patient) {
        res.status(404).send("Patient non trouvé");
        return;
    }
    res.status(200).json(patients_mapper_1.PatientsMapper.toShortDTO(patient));
});
/**
 * GET/Patient/niss/:niss
 */
exports.patientsController.get("/niss/:niss", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[GET] /patients/niss/:niss");
    const niss = req.params.niss;
    if (!(0, guards_1.isNiss)(niss)) {
        res.status(400).send("NISS invalide");
        return;
    }
    const patient = patients_service_1.PatientsService.getByNiss(niss);
    if (patient) {
        res.status(200).json(patients_mapper_1.PatientsMapper.toDTO(patient));
    }
    else {
        res.status(404).send('Patient not found');
    }
});
/**
 * GET/patient/:id
 */
exports.patientsController.get("/:id/short", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[GET] /patients/:id/short");
    const id = Number(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send('ID must be a number');
        return;
    }
    const patient = patients_service_1.PatientsService.getById(id);
    if (patient) {
        res.status(200).json(patients_mapper_1.PatientsMapper.toShortDTO(patient));
    }
    else {
        res.status(404).send('Patient not found');
    }
});
/**
 * GET/patient/:id/zipcode
 */
exports.patientsController.get("/zipcode/:zipcode", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[GET] /patients/zipcode/:zipcode");
    const zipcode = req.params.zipcode;
    if (!(0, guards_1.isString)(zipcode)) {
        res.status(400).send('Zipcode must be a string');
        return;
    }
    const patients = patients_service_1.PatientsService.getByZipCode(zipcode);
    const results = patients.map(p => patients_mapper_1.PatientsMapper.toDTO(p));
    if (results.length > 0) {
        res.status(200).json(results);
    }
    else {
        res.status(404).send('Patient not found');
    }
});
/**
 * GET/doctor/:id/zipcode/:zipcode
 */
exports.patientsController.get("/doctor/:id/zipcode/:zipcode", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[GET] /patients/doctor/:id/zipcode/:zipcode");
    const id = Number(req.params.id);
    const zipcode = req.params.zipcode;
    if (!(0, guards_1.isNumber)(id) || !(0, guards_1.isString)(zipcode)) {
        res.status(400).send("Invalid format");
        return;
    }
    const patients = patients_service_1.PatientsService.getByZipCode(zipcode);
    const results = patients
        .filter(p => p.refDoctor === id)
        .map(p => patients_mapper_1.PatientsMapper.toDTO(p));
    if (results.length > 0) {
        res.status(200).json(results);
    }
    else {
        res.status(404).send('Patient not found');
    }
});
/**
 * POST /patients
 */
exports.patientsController.post("/", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[POST] /patients/");
    const newPatientDTO = req.body;
    if (!newPatientDTO.firstName || !newPatientDTO.lastName || !newPatientDTO.birthDate) {
        logger_service_1.LoggerService.error("POST /patients - Invalid new patient data");
        res.status(400).send("Invalid patient data");
        return;
    }
    const newPatient = patients_mapper_1.PatientsMapper.fromNewDTO(newPatientDTO);
    const patientToCreate = {
        id: 0,
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        birthDate: newPatient.birthDate,
        niss: newPatient.niss,
        address: newPatient.address,
        refDoctor: newPatient.refDoctor
    };
    const createdPatient = patients_service_1.PatientsService.create(patientToCreate);
    if (!createdPatient) {
        res.status(422).send("Unprocessable entity : NISS already exists or Doctor not found");
        return;
    }
    res.status(201).json(patients_mapper_1.PatientsMapper.toDTO(createdPatient));
});
exports.patientsController.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedPatientDTO = req.body;
    if (!(0, guards_1.isNumber)(id)) {
        logger_service_1.LoggerService.error("PUT /patients/:id - Invalid ID parameter");
        res.status(400).send("ID parameter must be a number");
        return;
    }
    if (id !== updatedPatientDTO.id) {
        logger_service_1.LoggerService.error("PUT /patients/:id - Invalid body");
        res.status(400).send("Invalid patient data");
        return;
    }
    const patientToUpdate = patients_mapper_1.PatientsMapper.fromDTO(updatedPatientDTO);
    const updatedPatient = patients_service_1.PatientsService.update(id, patientToUpdate);
    if (id === -1) {
        logger_service_1.LoggerService.error(`PUT /patients/:id - Patient with ID ${id} not found`);
        res.status(404).send("Patient not found");
        return;
    }
    res.status(200).json(patients_mapper_1.PatientsMapper.toDTO(updatedPatientDTO));
});
/**
 * DELETE /patients/:id
 */
exports.patientsController.delete("/:id", auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info(`[DELETE] /patients/${req.params.id}`);
    const id = Number(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send("Invalid or missing id");
        return;
    }
    const isDeleted = patients_service_1.PatientsService.delete(id);
    if (!isDeleted) {
        res.status(404).send("Patient not found");
        return;
    }
    res.status(200).send();
});
