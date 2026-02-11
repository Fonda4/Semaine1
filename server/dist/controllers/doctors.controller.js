"use strict";
/**
 * This file contains all the logic for the doctors controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorsController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
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
    res.json(doctors).status(200);
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
            res.json(doctors[i]).status(200);
            break;
        }
    }
    res.status(404).send('ID must be a correct number');
    return;
});
