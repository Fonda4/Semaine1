"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsController = void 0;
const patients_mapper_1 = require("../mappers/patients.mapper");
const express_1 = require("express");
const guards_1 = require("../utils/guards");
exports.patientsController = (0, express_1.Router)();
console.log("OK");
const patients = [
    { id: 1, firstName: "John", lastName: "Lecarre", birthDate: new Date("1964-05-11"), niss: "640511-123-45",
        address: { street: "Rue du polar", number: "273-B", zipCode: "1000", city: "Bruxelles", country: "Belgique" },
        refDoctor: 1 },
    { id: 2, firstName: "Gabrielle", lastName: "Garcias Marques", birthDate: new Date("1978-12-03"), niss: "781203-123-45",
        address: { street: "Rue du merveilleux", number: "57", zipCode: "1000", city: "Bruxelles", country: "Belgique" },
        refDoctor: 2 },
    { id: 3, firstName: "Tintin", lastName: "Reporter", birthDate: new Date("1929-01-10"), niss: "290110-999-88",
        address: { street: "Château de Moulinsart", number: "1", zipCode: "5000", city: "Namur", country: "Belgique" },
        refDoctor: 1
    },
    { id: 4, firstName: "Kamel", lastName: "Kebir", birthDate: new Date("1995-03-03"), niss: "950303-975-31",
        address: { street: "Karmine Corp", number: "67", zipCode: "9400", city: "Aubervilliers", country: "France" },
        refDoctor: 2 }
];
exports.patientsController.get("/", (req, res) => {
    console.log("[GET] /patients/");
    const patientsDTO = patients;
    res.status(200).json(patientsDTO);
});
exports.patientsController.get("/:id", (req, res) => {
    console.log("[GET] /short/:id");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        console.log('invalid id');
        res.status(400).send('ID must be a number');
        return;
    }
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].id == id) {
            const PatientDTO = patients_mapper_1.PatientsMapper.toShortDTO(patients[i]);
            res.status(200).json(PatientDTO);
            return;
        }
    }
    res.status(404).send('Patient not found');
});
exports.patientsController.get("/niss/:niss", (req, res) => {
    console.log("[GET] /patients/:niss");
    const niss = req.params.niss;
    if (!(0, guards_1.isNiss)(niss)) {
        console.log('invalid niss');
        res.status(400).send("NISS invalide ");
        return;
    }
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].niss === niss) {
            const PatientDTO = patients_mapper_1.PatientsMapper.toDTO(patients[i]);
            res.status(200).json(PatientDTO);
            return;
        }
    }
    res.status(404).send('Patient not found');
});
exports.patientsController.get("/:id/short", (req, res) => {
    console.log("[GET] /patient/:id/short");
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        console.log('invalid id');
        res.status(400).send('ID must be a number');
        return;
    }
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].id == id) {
            const PatientDTO = patients_mapper_1.PatientsMapper.toShortDTO(patients[i]);
            res.status(200).json(PatientDTO);
            return;
        }
    }
    res.status(404).send('Patient not found');
});
exports.patientsController.get("/zipcode/:zipcode", (req, res) => {
    console.log("[GET] /patients/zipcode/:zipcode");
    const zipcode = req.params.zipcode;
    if (!(0, guards_1.isString)(zipcode)) {
        console.log('invalid zipcode format');
        res.status(400).send('Zipcode must be a string');
        return;
    }
    let results = [];
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].address.zipCode === zipcode) {
            results.push(patients_mapper_1.PatientsMapper.toDTO(patients[i]));
        }
    }
    if (results.length > 0) {
        res.status(200).json(results);
        return;
    }
    res.status(404).send('Patient not found');
});
exports.patientsController.get("/doctor/:id/zipcode/:zipcode", (req, res) => {
    console.log("[GET] /patients/doctor/:id/zipcode/:zipcode");
    const id = parseInt(req.params.id);
    const zipcode = req.params.zipcode;
    if (!(0, guards_1.isNumber)(id) || !(0, guards_1.isString)(zipcode)) {
        console.log("invalid parameters");
        res.status(400).send("Invalid format");
        return;
    }
    let results = [];
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].refDoctor === id && patients[i].address.zipCode === zipcode) {
            results.push(patients_mapper_1.PatientsMapper.toDTO(patients[i]));
        }
    }
    if (results.length > 0) {
        res.status(200).json(results);
        return;
    }
    res.status(404).send('Patient not found');
});
exports.patientsController.post("/", (req, res) => {
    const newPatientDTO = req.body;
    if (!newPatientDTO.firstName || !newPatientDTO.lastName || !newPatientDTO.birthDate) {
        res.status(400).send("Invalid patient data");
        return;
    }
    const newPatient = patients_mapper_1.PatientsMapper.fromNewDTO(newPatientDTO);
    let newId = 0;
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].id > newId) {
            newId = patients[i].id;
        }
    }
    newId++;
    const patient = {
        id: newId,
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        birthDate: newPatient.birthDate,
        niss: newPatient.niss,
        address: newPatient.address,
        refDoctor: newPatient.refDoctor
    };
    patients[patients.length] = patient;
    res.status(201).json(patients_mapper_1.PatientsMapper.toDTO(patient));
});
exports.patientsController.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const updatedPatientDTO = req.body;
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send("ID parameter must be a number");
        return;
    }
    if (id !== updatedPatientDTO.id) {
        res.status(400).send("Body ID does not match Parameter ID");
        return;
    }
    let index = -1;
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].id === id) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        res.status(404).send("Patient not found");
        return;
    }
    const updatedPatient = patients_mapper_1.PatientsMapper.fromDTO(updatedPatientDTO);
    patients[index] = updatedPatient;
    res.status(200).json(patients_mapper_1.PatientsMapper.toDTO(patients[index]));
});
exports.patientsController.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send("Invalid or missing id");
        return;
    }
    let index = -1;
    for (let i = 0; i < patients.length; i++) {
        if (patients[i].id === id) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        res.status(404).send("Patient not found");
        return;
    }
    patients.splice(index, 1);
    res.status(200).send();
});
