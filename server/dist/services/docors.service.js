"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const files_service_1 = require("../models/files.service");
const logger_service_1 = require("./logger.service");
const doctors_mapper_1 = require("../mappers/doctors.mapper");
class DoctorsService {
    static getAll(filter) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            let doctors = doctorsDBO.map(dbo => doctors_mapper_1.DoctorsMapper.fromDBO(dbo));
            if (filter && filter.speciality) {
                doctors = doctors.filter(doctor => doctor.speciality === filter.speciality);
            }
            return doctors;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return [];
        }
    }
    static getById(id) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const doctorDBO = doctorsDBO.find(dbo => dbo.id === id);
            if (doctorDBO) {
                return doctors_mapper_1.DoctorsMapper.fromDBO(doctorDBO);
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static create(newDoctor) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const maxId = doctorsDBO.length > 0 ? Math.max(...doctorsDBO.map(d => d.id)) : 0;
            const newId = maxId + 1;
            const doctorToCreate = {
                id: newId,
                firstName: newDoctor.firstName,
                lastName: newDoctor.lastName,
                speciality: newDoctor.speciality
            };
            doctorsDBO.push(doctors_mapper_1.DoctorsMapper.toDBO(doctorToCreate));
            files_service_1.FilesService.writeFile('data/doctors.json', doctorsDBO);
            return doctorToCreate;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static update(id, updatedDoctor) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const index = doctorsDBO.findIndex(dbo => dbo.id === id);
            if (index === -1) {
                return undefined;
            }
            updatedDoctor.id = id;
            doctorsDBO[index] = doctors_mapper_1.DoctorsMapper.toDBO(updatedDoctor);
            files_service_1.FilesService.writeFile('data/doctors.json', doctorsDBO);
            return updatedDoctor;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static delete(id) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const index = doctorsDBO.findIndex(dbo => dbo.id === id);
            if (index === -1) {
                return false;
            }
            doctorsDBO.splice(index, 1);
            files_service_1.FilesService.writeFile('data/doctors.json', doctorsDBO);
            return true;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return false;
        }
    }
}
exports.DoctorsService = DoctorsService;
