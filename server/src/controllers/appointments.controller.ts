import { Router, Request, Response } from 'express';
import { AppointmentsService } from '../services/appointment.service';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';
import { isAppointment, isNewAppointment, isNumber } from '../utils/guards';
import { EAppointmentStatus, NewAppointmentDTO,Appointment,AppointmentDTO } from '../models/appointment.model';

const appointmentsController = Router();
LoggerService.debug("OK appointment");

appointmentsController.get('/', AuthService.authorize, (req: Request, res: Response) => {
      LoggerService.info(`GET/appointment/`);

    const Appointment : AppointmentDTO = req.body    

    if(!isAppointment(Appointment)){
        res.status(400)
        LoggerService.error(`It must be a appointment`)
        return;
    }

    const appointments = AppointmentsService.getAll(req.query);
    LoggerService.info('GetAllAppointment')    
    
    return res.status(200).json(appointments);
        
});

appointmentsController.get('/:id', AuthService.authorize, (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const appointment = AppointmentsService.getById(id);
        
        if(!isNumber(id)){
        res.status(400)
        LoggerService.error(`It must be a number`)
        return;
        }

        if (!appointment) {
            const msg = `Appointment with id ${id} not found`;
            LoggerService.error(msg);
            return res.status(404).send(msg);
        }
        
        LoggerService.info('GetOneIdAppointment')    
        return res.status(200).json(appointment);

});


appointmentsController.post('/', AuthService.authorize, (req: Request, res: Response) => {
    LoggerService.info ('[POST] / appointment/');

    const NewAppointment : NewAppointmentDTO = req.body    


        if (!isNewAppointment(req.body)) {
            const msg = "Invalid appointment data";
            LoggerService.error(msg);
            return res.status(400).send(msg);
        }

        const createdAppointment = AppointmentsService.create(req.body);
        LoggerService.info("Appointment crée")
        return res.status(201).json(createdAppointment);

        
    });





appointmentsController.put('/:id', AuthService.authorize, (req: Request, res: Response) => {
    LoggerService.info ("[POST] / appointment/:id");
    const id = Number(req.params.id);
        
        if (!isAppointment(req.body)) {
            const msg = "Invalid appointment update data";
            LoggerService.error(msg);
            return res.status(400).send(msg);
        }

        const updatedAppointment = AppointmentsService.update(id, req.body);
        
        if (!updatedAppointment) {
            const msg = `Appointment with id ${id} not found`;
            LoggerService.error(msg);
            return res.status(404).send(msg);
        }
        
        LoggerService.info(`PUT /appointments/:id MAJ `);       
        return res.status(200).json(updatedAppointment);

});


appointmentsController.delete('/:id', AuthService.authorize, (req: Request, res: Response) => {
    LoggerService.info(`[DELETE] /appointment/${req.params.id}`)
    
    const id = Number(req.params.id);
        
    if (!isNumber(id)) {
    res.status(400).send("Invalid or missing id");
    return;
    }

    const isDeleted = AppointmentsService.delete(id);


    if (!isDeleted) {
        const msg = `Appointment with id ${id} not found`;
        LoggerService.error(msg);
        return res.status(404).send(msg);
    }
    
    return res.status(200).send();
});


appointmentsController.patch('/:id/status/:newStatus', AuthService.authorize, (req: Request, res: Response) => {
    LoggerService.info(`/appointments/:id${req.params.id}/status/:newStatus`)

    const id = Number(req.params.id);

    const newStatus = req.params.newStatus as EAppointmentStatus; 

        if (!Object.values(EAppointmentStatus).includes(newStatus)) {
            const msg = `Invalid status: ${newStatus}`;
            LoggerService.error(msg);
            return res.status(400).send(msg);
        }

        const currentAppointment = AppointmentsService.getById(id);
        if (!currentAppointment) {
            const msg = `Appointment with id ${id} not found`;
            LoggerService.error(msg);
            return res.status(404).send(msg);
        }

        let isValidTransition = false;
        if (currentAppointment.status === EAppointmentStatus.NEW) {
            if (newStatus === EAppointmentStatus.CONFIRMED || newStatus === EAppointmentStatus.CANCELLED) {
                isValidTransition = true;
            }
        } else if (currentAppointment.status === EAppointmentStatus.CONFIRMED) {
            if (newStatus === EAppointmentStatus.CANCELLED) {
                isValidTransition = true;
            }
        }

        if (!isValidTransition) {
            const msg = `Invalid status transition from ${currentAppointment.status} to ${newStatus}`;
            LoggerService.error(msg);
            return res.status(400).send(msg);
        }

        const updatedAppointment = AppointmentsService.updateStatus(id, newStatus);
        return res.status(200).json(updatedAppointment);


});



export default appointmentsController;