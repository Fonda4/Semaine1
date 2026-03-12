"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const files_service_1 = require("./files.service");
const logger_service_1 = require("./logger.service");
const patients_mapper_1 = require("../mappers/patients.mapper");
const doctors_service_1 = require("./doctors.service");
class PatientsService {
    static findPatientIndex(patients, id) {
        return patients.findIndex(patient => patient.id === id);
    }
    static getAll(filter) {
        try {
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            let patients = patientsDBO.map(dbo => patients_mapper_1.PatientsMapper.fromDBO(dbo));
            // SOFT DELETE : On retire tous les patients qui ont une date de suppression
            patients = patients.filter(patient => !patient.deletedAt);
            if (filter && filter.zipCode) {
                patients = patients.filter(patient => patient.address.zipCode === filter.zipCode);
            }
            return patients;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return [];
        }
    }
    static getById(id) {
        try {
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findPatientIndex(patientsDBO, id);
            // SOFT DELETE : On vérifie que le patient existe ET qu'il n'est pas supprimé
            if (index !== -1 && !patientsDBO[index].deleted_at) {
                return patients_mapper_1.PatientsMapper.fromDBO(patientsDBO[index]);
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static create(patient) {
        try {
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const nissExists = patientsDBO.some(p => p.niss === patient.niss && !p.deleted_at);
            if (nissExists) {
                logger_service_1.LoggerService.error(`Création échouée: Le patient avec le NISS ${patient.niss} existe déjà.`);
                return undefined;
            }
            const doctorExists = doctors_service_1.DoctorsService.getById(patient.refDoctor);
            if (!doctorExists) {
                logger_service_1.LoggerService.error(`Création échouée: Le médecin avec l'ID ${patient.refDoctor} n'existe pas.`);
                return undefined;
            }
            const maxId = patientsDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
            patient.id = maxId + 1;
            // TRACKING : Ajout des dates de création et de mise à jour au moment de la création
            patient.createdAt = new Date();
            patient.updatedAt = new Date();
            patientsDBO.push(patients_mapper_1.PatientsMapper.toDBO(patient));
            files_service_1.FilesService.writeFile(this.FILE_PATH, patientsDBO);
            return patient;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static update(id, patient) {
        try {
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findPatientIndex(patientsDBO, id);
            // SOFT DELETE : On vérifie qu'il n'est pas supprimé avant de le mettre à jour
            if (index !== -1 && !patientsDBO[index].deleted_at) {
                const doctorExists = doctors_service_1.DoctorsService.getById(patient.refDoctor);
                if (!doctorExists) {
                    logger_service_1.LoggerService.error(`Mise à jour échouée: Le médecin avec l'ID ${patient.refDoctor} n'existe pas.`);
                    return undefined;
                }
                patient.id = id;
                patient.createdAt = patientsDBO[index].created_at ? new Date(patientsDBO[index].created_at) : new Date();
                patient.updatedAt = new Date();
                patientsDBO[index] = patients_mapper_1.PatientsMapper.toDBO(patient);
                files_service_1.FilesService.writeFile(this.FILE_PATH, patientsDBO);
                return patient;
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
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findPatientIndex(patientsDBO, id);
            if (index !== -1 && !patientsDBO[index].deleted_at) {
                patientsDBO[index].deleted_at = new Date().toISOString();
                files_service_1.FilesService.writeFile(this.FILE_PATH, patientsDBO);
                return true;
            }
            return false;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return false;
        }
    }
    static getByNiss(niss) {
        try {
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const patientDBO = patientsDBO.find(p => p.niss === niss && !p.deleted_at);
            if (patientDBO) {
                return patients_mapper_1.PatientsMapper.fromDBO(patientDBO);
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static getByZipCode(zipCode) {
        try {
            const patientsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const filteredDBO = patientsDBO.filter(p => p.address.zip_code === zipCode && !p.deleted_at);
            return filteredDBO.map(dbo => patients_mapper_1.PatientsMapper.fromDBO(dbo));
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return [];
        }
    }
}
exports.PatientsService = PatientsService;
PatientsService.FILE_PATH = 'data/patients.json';
