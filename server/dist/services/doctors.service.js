"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const files_service_1 = require("./files.service");
const logger_service_1 = require("./logger.service");
const doctors_mapper_1 = require("../mappers/doctors.mapper");
class DoctorsService {
    static findDoctorIndex(doctors, id) {
        for (let i = 0; i < doctors.length; i++) {
            if (doctors[i].id === id) {
                return i;
            }
        }
        return -1;
    }
    static getAll(filter) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            let doctors = doctorsDBO.map(dbo => doctors_mapper_1.DoctorsMapper.fromDBO(dbo));
            doctors = doctors.filter(doctor => !doctor.deletedAt);
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
            const index = this.findDoctorIndex(doctorsDBO, id);
            if (index !== -1 && !doctorsDBO[index].deleted_at) {
                return doctors_mapper_1.DoctorsMapper.fromDBO(doctorsDBO[index]);
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static create(doctor) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const maxId = doctorsDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
            doctor.id = maxId + 1;
            doctor.createdAt = new Date();
            doctor.updatedAt = new Date();
            doctorsDBO.push(doctors_mapper_1.DoctorsMapper.toDBO(doctor));
            files_service_1.FilesService.writeFile('data/doctors.json', doctorsDBO);
            return doctor;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static update(id, doctor) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const index = this.findDoctorIndex(doctorsDBO, id);
            if (index !== -1 && !doctorsDBO[index].deleted_at) {
                doctor.id = id;
                doctor.createdAt = doctorsDBO[index].created_at ? new Date(doctorsDBO[index].created_at) : new Date();
                doctor.updatedAt = new Date();
                doctorsDBO[index] = doctors_mapper_1.DoctorsMapper.toDBO(doctor);
                files_service_1.FilesService.writeFile('data/doctors.json', doctorsDBO);
                return doctor;
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static delete(id) {
        try {
            const doctorsDBO = files_service_1.FilesService.readFile('data/doctors.json');
            const index = this.findDoctorIndex(doctorsDBO, id);
            if (index !== -1 && !doctorsDBO[index].deleted_at) {
                doctorsDBO[index].deleted_at = new Date().toISOString();
                files_service_1.FilesService.writeFile('data/doctors.json', doctorsDBO);
                return true;
            }
            return false;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return false;
        }
    }
}
exports.DoctorsService = DoctorsService;
