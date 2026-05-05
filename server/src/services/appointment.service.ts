import { Appointment, AppointmentDBO, EAppointmentStatus, NewAppointment } from "../models/appointment.model";
import { FilesService } from "./files.service";
import { LoggerService } from "./logger.service";
import { AppointmentsMapper } from "../mappers/appointment.mapper";
import { DoctorsService } from "./doctors.service";
import { PatientsService } from "./patients.service";

export class AppointmentsService {

  private static readonly FILE_PATH = 'data/appointments.json';

  private static findAppointmentIndex(appointments: AppointmentDBO[], id: number): number {
    return appointments.findIndex(appointment => appointment.id === id);
  }

  public static getAll(filters?: any): Appointment[] {
    try {
      const appointmentsDBO = FilesService.readFile<AppointmentDBO>(this.FILE_PATH);
      let appointments = appointmentsDBO.map(dbo => AppointmentsMapper.fromDBO(dbo));

      // SOFT DELETE : On retire tous les rendez-vous qui ont une date de suppression
      appointments = appointments.filter(appointment => !appointment.deletedAt);

      if (filters) {
        if (filters.doctorId) appointments = appointments.filter(a => a.doctorId === Number(filters.doctorId));
        if (filters.patientId) appointments = appointments.filter(a => a.patientId === Number(filters.patientId));
        if (filters.status) appointments = appointments.filter(a => a.status === filters.status);
      }

      return appointments;
    } catch (error) {
      LoggerService.error(error);
      return [];
    }
  }

  public static getById(id: number): Appointment | undefined {
    try {
      const appointmentsDBO = FilesService.readFile<AppointmentDBO>(this.FILE_PATH);
      const index = this.findAppointmentIndex(appointmentsDBO, id);
      
      if (index !== -1 && !appointmentsDBO[index].deleted_at) {
        return AppointmentsMapper.fromDBO(appointmentsDBO[index]);
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static create(newAppointment: NewAppointment): Appointment | undefined {
    try {
      const appointmentsDBO = FilesService.readFile<AppointmentDBO>(this.FILE_PATH);
      
      // VÉRIFICATION DE L'INTÉGRITÉ
      const doctorExists = DoctorsService.getById(newAppointment.doctorId);
      if (!doctorExists) {
        LoggerService.error(`Création échouée: Le médecin avec l'ID ${newAppointment.doctorId} n'existe pas.`);
        return undefined;
      }
      const patientExists = PatientsService.getById(newAppointment.patientId);
      if (!patientExists) {
        LoggerService.error(`Création échouée: Le patient avec l'ID ${newAppointment.patientId} n'existe pas.`);
        return undefined;
      }

      const maxId = appointmentsDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
      
      const appointment: Appointment = {
        id: maxId + 1,
        ...newAppointment,
        status: EAppointmentStatus.NEW, // Imposé par le service selon la consigne
        createdAt: new Date(),
        updatedAt: new Date()
      };

      appointmentsDBO.push(AppointmentsMapper.toDBO(appointment));
      FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
      
      return appointment;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static update(id: number, appointmentData: Appointment): Appointment | undefined {
    try {
      const appointmentsDBO = FilesService.readFile<AppointmentDBO>(this.FILE_PATH);
      const index = this.findAppointmentIndex(appointmentsDBO, id);

      if (index !== -1 && !appointmentsDBO[index].deleted_at) {
        
        const doctorExists = DoctorsService.getById(appointmentData.doctorId);
        if (!doctorExists) {
          LoggerService.error(`Mise à jour échouée: Le médecin avec l'ID ${appointmentData.doctorId} n'existe pas.`);
          return undefined;
        }
        const patientExists = PatientsService.getById(appointmentData.patientId);
        if (!patientExists) {
          LoggerService.error(`Mise à jour échouée: Le patient avec l'ID ${appointmentData.patientId} n'existe pas.`);
          return undefined;
        }

        appointmentData.id = id;
        appointmentData.createdAt = appointmentsDBO[index].created_at ? new Date(appointmentsDBO[index].created_at as string) : new Date();
        appointmentData.updatedAt = new Date();

        appointmentsDBO[index] = AppointmentsMapper.toDBO(appointmentData);
        FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
        return appointmentData;
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static updateStatus(id: number, newStatus: EAppointmentStatus): Appointment | undefined {
    try {
      const appointmentsDBO = FilesService.readFile<AppointmentDBO>(this.FILE_PATH);
      const index = this.findAppointmentIndex(appointmentsDBO, id);

      if (index !== -1 && !appointmentsDBO[index].deleted_at) {
        // On récupère le modèle, on modifie le statut et on actualise l'horodatage de mise à jour
        const appointment = AppointmentsMapper.fromDBO(appointmentsDBO[index]);
        appointment.status = newStatus;
        appointment.updatedAt = new Date();

        appointmentsDBO[index] = AppointmentsMapper.toDBO(appointment);
        FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
        return appointment;
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static delete(id: number): boolean {
    try {
      const appointmentsDBO = FilesService.readFile<AppointmentDBO>(this.FILE_PATH);
      const index = this.findAppointmentIndex(appointmentsDBO, id);

      if (index !== -1 && !appointmentsDBO[index].deleted_at) {
        appointmentsDBO[index].deleted_at = new Date().toISOString();
        FilesService.writeFile(this.FILE_PATH, appointmentsDBO);
        return true;
      }
      return false;
    } catch (error) {
      LoggerService.error(error);
      return false;
    }
  }
}