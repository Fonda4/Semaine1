"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsController = void 0;
const express_1 = require("express");
exports.patientsController = (0, express_1.Router)();
console.log("OK");
const patients = [
    { id: 1, firstName: "John", lastName: "Lecarre", birthDate: new Date("1964-05-11"), niss: "640511-123-45",
        address: { street: "Rue du polar", number: "273-B", zipCode: "1000", city: "Bruxelles", country: "Belgique" },
        refDoctor: 1 },
    { id: 2, firstName: "Gabrielle", lastName: "Garcias Marques", birthDate: new Date("1978-12-03"), niss: "781203-123-45",
        address: { street: "Rue du merveilleux", number: "57", zipCode: "1000", city: "Bruxelles", country: "Belgique" },
        refDoctor: 2 }
];
exports.patientsController.get("/", (req, res) => {
    console.log("[GET] /patients/");
    res.json(patients).status(200);
});
