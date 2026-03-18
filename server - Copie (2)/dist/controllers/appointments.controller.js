"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_service_1 = require("../services/appointment.service");
const auth_service_1 = require("../services/auth.service");
const logger_service_1 = require("../services/logger.service");
const guards_1 = require("../utils/guards");
const appointment_model_1 = require("../models/appointment.model");
const appointmentsController = (0, express_1.Router)();
logger_service_1.LoggerService.debug("OK appointment");
appointmentsController.get('/', auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info(`GET/appointment/`);
    const Appointment = req.body;
    if (!(0, guards_1.isAppointment)(Appointment)) {
        res.status(400);
        logger_service_1.LoggerService.error(`It must be a appointment`);
        return;
    }
    const appointments = appointment_service_1.AppointmentsService.getAll(req.query);
    logger_service_1.LoggerService.info('GetAllAppointment');
    return res.status(200).json(appointments);
});
appointmentsController.get('/:id', auth_service_1.AuthService.authorize, (req, res) => {
    const id = Number(req.params.id);
    const appointment = appointment_service_1.AppointmentsService.getById(id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400);
        logger_service_1.LoggerService.error(`It must be a number`);
        return;
    }
    if (!appointment) {
        const msg = `Appointment with id ${id} not found`;
        logger_service_1.LoggerService.error(msg);
        return res.status(404).send(msg);
    }
    logger_service_1.LoggerService.info('GetOneIdAppointment');
    return res.status(200).json(appointment);
});
appointmentsController.post('/', auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info('[POST] / appointment/');
    const NewAppointment = req.body;
    if (!(0, guards_1.isNewAppointment)(req.body)) {
        const msg = "Invalid appointment data";
        logger_service_1.LoggerService.error(msg);
        return res.status(400).send(msg);
    }
    const createdAppointment = appointment_service_1.AppointmentsService.create(req.body);
    logger_service_1.LoggerService.info("Appointment crée");
    return res.status(201).json(createdAppointment);
});
appointmentsController.put('/:id', auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info("[POST] / appointment/:id");
    const id = Number(req.params.id);
    if (!(0, guards_1.isAppointment)(req.body)) {
        const msg = "Invalid appointment update data";
        logger_service_1.LoggerService.error(msg);
        return res.status(400).send(msg);
    }
    const updatedAppointment = appointment_service_1.AppointmentsService.update(id, req.body);
    if (!updatedAppointment) {
        const msg = `Appointment with id ${id} not found`;
        logger_service_1.LoggerService.error(msg);
        return res.status(404).send(msg);
    }
    logger_service_1.LoggerService.info(`PUT /appointments/:id MAJ `);
    return res.status(200).json(updatedAppointment);
});
appointmentsController.delete('/:id', auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info(`[DELETE] /appointment/${req.params.id}`);
    const id = Number(req.params.id);
    if (!(0, guards_1.isNumber)(id)) {
        res.status(400).send("Invalid or missing id");
        return;
    }
    const isDeleted = appointment_service_1.AppointmentsService.delete(id);
    if (!isDeleted) {
        const msg = `Appointment with id ${id} not found`;
        logger_service_1.LoggerService.error(msg);
        return res.status(404).send(msg);
    }
    return res.status(200).send();
});
appointmentsController.patch('/:id/status/:newStatus', auth_service_1.AuthService.authorize, (req, res) => {
    logger_service_1.LoggerService.info(`/appointments/:id${req.params.id}/status/:newStatus`);
    const id = Number(req.params.id);
    const newStatus = req.params.newStatus;
    if (!Object.values(appointment_model_1.EAppointmentStatus).includes(newStatus)) {
        const msg = `Invalid status: ${newStatus}`;
        logger_service_1.LoggerService.error(msg);
        return res.status(400).send(msg);
    }
    const currentAppointment = appointment_service_1.AppointmentsService.getById(id);
    if (!currentAppointment) {
        const msg = `Appointment with id ${id} not found`;
        logger_service_1.LoggerService.error(msg);
        return res.status(404).send(msg);
    }
    let isValidTransition = false;
    if (currentAppointment.status === appointment_model_1.EAppointmentStatus.NEW) {
        if (newStatus === appointment_model_1.EAppointmentStatus.CONFIRMED || newStatus === appointment_model_1.EAppointmentStatus.CANCELLED) {
            isValidTransition = true;
        }
    }
    else if (currentAppointment.status === appointment_model_1.EAppointmentStatus.CONFIRMED) {
        if (newStatus === appointment_model_1.EAppointmentStatus.CANCELLED) {
            isValidTransition = true;
        }
    }
    if (!isValidTransition) {
        const msg = `Invalid status transition from ${currentAppointment.status} to ${newStatus}`;
        logger_service_1.LoggerService.error(msg);
        return res.status(400).send(msg);
    }
    const updatedAppointment = appointment_service_1.AppointmentsService.updateStatus(id, newStatus);
    return res.status(200).json(updatedAppointment);
});
exports.default = appointmentsController;
