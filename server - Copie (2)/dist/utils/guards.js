"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = isNumber;
exports.isString = isString;
exports.isDoctor = isDoctor;
exports.isDoctorDTO = isDoctorDTO;
exports.isNewDoctor = isNewDoctor;
exports.isPatient = isPatient;
exports.isNewPatient = isNewPatient;
exports.isNiss = isNiss;
exports.isDate = isDate;
exports.isNewUser = isNewUser;
exports.isAppointmentStatus = isAppointmentStatus;
exports.isNewAppointment = isNewAppointment;
exports.isAppointment = isAppointment;
// import { MedicalExamDTO } from "../models/medical-exam.model.dto";
const appointment_model_1 = require("../models/appointment.model");
/**
 * Function that validates that an input is a number
 * @param data any data
 * @returns true if data is a number
 */
function isNumber(data) {
    return data !== undefined && data !== null && typeof data === 'number' && !isNaN(data);
}
/**
 * Function that validates that an input is a string
 * @param data any data
 * @returns true if data is a string
*/
function isString(data) {
    return data !== undefined && data !== null && typeof data === 'string';
}
/**
 * Function that validates that an input is a valid Doctor model
 * @param data
 * @returns true if data is a valid Doctor model
 */
function isDoctor(data) {
    if (data && typeof data === 'object' &&
        (data.id === undefined || typeof data.id == 'number') &&
        'firstName' in data && 'lastName' in data &&
        'speciality' in data &&
        typeof data.firstName === 'string' &&
        typeof data.lastName === 'string' &&
        typeof data.speciality === 'string') {
        return true;
    }
    return false;
}
function isDoctorDTO(data) {
    return isDoctor(data);
}
/**
 * Function that validates that an input is a valid Doctor model
 * @param data
 * @returns true if data is a valid Doctor model
 */
function isNewDoctor(data) {
    if (data && typeof data === 'object' &&
        'firstName' in data && 'lastName' in data &&
        'speciality' in data &&
        typeof data.firstName === 'string' &&
        typeof data.lastName === 'string' &&
        typeof data.speciality === 'string') {
        return true;
    }
    return false;
}
/**
 * Function that validates that an input is a valid Patient model
 * @param data
 * @returns true if data is a valid Patient model
 */
function isPatient(data) {
    if (data && typeof data === 'object' &&
        (data.id === undefined || typeof data.id == 'number') &&
        'firstName' in data && 'lastName' in data &&
        'birthDate' in data && 'niss' in data &&
        'address' in data && 'refDoctor' in data &&
        typeof data.firstName === 'string' &&
        ((typeof data.birthDate === 'string') || data.birthDate instanceof Date) &&
        typeof data.niss === 'string' &&
        typeof data.address === 'object' && isAddress(data.address) &&
        typeof data.refDoctor === 'number') {
        return true;
    }
    return false;
}
function isNewPatient(data) {
    if (data && typeof data === 'object' &&
        'firstName' in data && 'lastName' in data &&
        'birthDate' in data && 'niss' in data &&
        'address' in data &&
        typeof data.firstName === 'string' &&
        ((typeof data.birthDate === 'string') || (isDate(data.birthDate))) &&
        typeof data.niss === 'string' &&
        typeof data.address === 'object' && isAddress(data.address)) {
        return true;
    }
    return false;
}
/**
 * Function that validates that an input is a valid Address
 * @param data any data
 * @returns true if data is a valid Address
 */
function isAddress(data) {
    return data && typeof data === 'object' &&
        typeof (data.street) === 'string' && typeof (data.number) === 'string' &&
        typeof (data.zipCode) === 'string' && typeof (data.city) === 'string' &&
        typeof (data.country) === 'string';
}
/**
 * Function that validates that an input is a valid niss
 * A valid niss is a string with the following format: XXXXXX-XXX-XX
 * @param data any data
 * @returns true if data is a valid niss
 */
function isNiss(data) {
    return typeof data === 'string' &&
        data.match(/^\d{6}-\d{3}-\d{2}$/) !== null;
}
function isDate(data) {
    return data != null && data != undefined && (typeof data === 'object') && (data instanceof Date);
}
// Si tu veux vérifier strictement que le rôle fait partie de EROLES, 
// n'oublie pas d'importer EROLES tout en haut de guards.ts :
// import { NewUserDTO, EROLES } from "../models/user.model";
function isNewUser(data) {
    return (data !== null &&
        data !== undefined &&
        typeof data === 'object' &&
        'username' in data && typeof data.username === 'string' &&
        'password' in data && typeof data.password === 'string' &&
        'email' in data && typeof data.email === 'string' &&
        'lastName' in data && typeof data.lastName === 'string' &&
        'firstName' in data && typeof data.firstName === 'string' &&
        'role' in data && typeof data.role === 'string' // Ici le rôle passe car "admin" est un string
    );
}
// export function isAppointment(data: unknown): data is AppointmentDTO {
//   return data != undefined && typeof data === 'object' &&
//   ((data as AppointmentDTO).id === undefined || typeof (data as AppointmentDTO).id == 'number') &&
//   'date' in data && 'doctor' in data &&
//   'patient' in data && 'status' in data &&
//   (typeof (data as AppointmentDTO).dateTime === 'string' || (typeof (data as AppointmentDTO).dateTime === 'object') && isDate((data as AppointmentDTO).dateTime)) &&
//   isNumber((data as Appointment).doctorId) &&
//   isNumber((data as Appointment).patientId) &&
//   (typeof (data as Appointment).status === 'string');
// }
// export function isAppointment(data: unknown): data is AppointmentDTO {
//   return data != undefined && typeof data === 'object' &&
//   isNewAppointment(data) &&
//   ((data as AppointmentDTO).id === undefined || typeof (data as AppointmentDTO).id == 'number');
// }
// export function isNewAppointment(data: unknown): data is NewAppointmentDTO {
//   return data != undefined && typeof data === 'object' &&
//     'dateTime' in data && 'doctorId' in data && 'patientId' in data &&
//     isString((data as NewAppointmentDTO).dateTime) &&
//     isNumber((data as NewAppointmentDTO).doctorId) &&
//     isNumber((data as NewAppointmentDTO).patientId);
// }
function isAppointmentStatus(data) {
    return Object.values(appointment_model_1.EAppointmentStatus).includes(data);
}
/**
 * Function that validates that an input is a valid NewAppointment
 */
function isNewAppointment(data) {
    return (data !== undefined &&
        data !== null &&
        typeof data === 'object' &&
        'dateTime' in data && typeof data.dateTime === 'string' &&
        'doctorId' in data && isNumber(data.doctorId) &&
        'patientId' in data && isNumber(data.patientId));
}
/**
 * Function that validates that an input is a valid Appointment (with ID)
 */
function isAppointment(data) {
    return (data !== undefined &&
        data !== null &&
        typeof data === 'object' &&
        isNewAppointment(data) &&
        'id' in data && isNumber(data.id));
}
