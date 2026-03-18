"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const appointment_model_1 = require("../models/appointment.model");
const files_service_1 = require("./files.service");
const logger_service_1 = require("./logger.service");
const appointment_mapper_1 = require("../mappers/appointment.mapper");
const doctors_service_1 = require("./doctors.service");
const patients_service_1 = require("./patients.service");
class AppointmentsService {
    static findAppointmentIndex(appointments, id) {
        return appointments.findIndex(appointment => appointment.id === id);
    }
    static getAll(filters) {
        try {
            const appointmentsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            let appointments = appointmentsDBO.map(dbo => appointment_mapper_1.AppointmentsMapper.fromDBO(dbo));
            // SOFT DELETE : On retire tous les rendez-vous qui ont une date de suppression
            appointments = appointments.filter(appointment => !appointment.deletedAt);
            if (filters) {
                if (filters.doctorId)
                    appointments = appointments.filter(a => a.doctorId === Number(filters.doctorId));
                if (filters.patientId)
                    appointments = appointments.filter(a => a.patientId === Number(filters.patientId));
                if (filters.status)
                    appointments = appointments.filter(a => a.status === filters.status);
            }
            return appointments;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return [];
        }
    }
    static getById(id) {
        try {
            const appointmentsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findAppointmentIndex(appointmentsDBO, id);
            if (index !== -1 && !appointmentsDBO[index].deleted_at) {
                return appointment_mapper_1.AppointmentsMapper.fromDBO(appointmentsDBO[index]);
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static create(newAppointment) {
        try {
            const appointmentsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            // VÉRIFICATION DE L'INTÉGRITÉ
            const doctorExists = doctors_service_1.DoctorsService.getById(newAppointment.doctorId);
            if (!doctorExists) {
                logger_service_1.LoggerService.error(`Création échouée: Le médecin avec l'ID ${newAppointment.doctorId} n'existe pas.`);
                return undefined;
            }
            const patientExists = patients_service_1.PatientsService.getById(newAppointment.patientId);
            if (!patientExists) {
                logger_service_1.LoggerService.error(`Création échouée: Le patient avec l'ID ${newAppointment.patientId} n'existe pas.`);
                return undefined;
            }
            const maxId = appointmentsDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
            const appointment = Object.assign(Object.assign({ id: maxId + 1 }, newAppointment), { status: appointment_model_1.EAppointmentStatus.NEW, createdAt: new Date(), updatedAt: new Date() });
            appointmentsDBO.push(appointment_mapper_1.AppointmentsMapper.toDBO(appointment));
            files_service_1.FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
            return appointment;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static update(id, appointmentData) {
        try {
            const appointmentsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findAppointmentIndex(appointmentsDBO, id);
            if (index !== -1 && !appointmentsDBO[index].deleted_at) {
                const doctorExists = doctors_service_1.DoctorsService.getById(appointmentData.doctorId);
                if (!doctorExists) {
                    logger_service_1.LoggerService.error(`Mise à jour échouée: Le médecin avec l'ID ${appointmentData.doctorId} n'existe pas.`);
                    return undefined;
                }
                const patientExists = patients_service_1.PatientsService.getById(appointmentData.patientId);
                if (!patientExists) {
                    logger_service_1.LoggerService.error(`Mise à jour échouée: Le patient avec l'ID ${appointmentData.patientId} n'existe pas.`);
                    return undefined;
                }
                appointmentData.id = id;
                appointmentData.createdAt = appointmentsDBO[index].created_at ? new Date(appointmentsDBO[index].created_at) : new Date();
                appointmentData.updatedAt = new Date();
                appointmentsDBO[index] = appointment_mapper_1.AppointmentsMapper.toDBO(appointmentData);
                files_service_1.FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
                return appointmentData;
            }
            return undefined;
        }
        catch (error) {
            logger_service_1.LoggerService.error(error);
            return undefined;
        }
    }
    static updateStatus(id, newStatus) {
        try {
            const appointmentsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findAppointmentIndex(appointmentsDBO, id);
            if (index !== -1 && !appointmentsDBO[index].deleted_at) {
                // On récupère le modèle, on modifie le statut et on actualise l'horodatage de mise à jour
                const appointment = appointment_mapper_1.AppointmentsMapper.fromDBO(appointmentsDBO[index]);
                appointment.status = newStatus;
                appointment.updatedAt = new Date();
                appointmentsDBO[index] = appointment_mapper_1.AppointmentsMapper.toDBO(appointment);
                files_service_1.FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
                return appointment;
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
            const appointmentsDBO = files_service_1.FilesService.readFile(this.FILE_PATH);
            const index = this.findAppointmentIndex(appointmentsDBO, id);
            if (index !== -1 && !appointmentsDBO[index].deleted_at) {
                appointmentsDBO[index].deleted_at = new Date().toISOString();
                files_service_1.FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
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
exports.AppointmentsService = AppointmentsService;
AppointmentsService.FILE_PATH = 'data/appointments.json';
