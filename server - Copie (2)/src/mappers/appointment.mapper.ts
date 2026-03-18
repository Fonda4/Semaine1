import { Appointment, AppointmentDTO, NewAppointment, NewAppointmentDTO, AppointmentDBO } from "../models/appointment.model";

export class AppointmentsMapper {
  
  public static toDTO(appointment: Appointment): AppointmentDTO {
    return {
      id: appointment.id,
      dateTime: appointment.dateTime,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };
  }

  public static toDBO(appointment: Appointment): AppointmentDBO {
    return {
      id: appointment.id,
      date_time: appointment.dateTime,
      doctor_id: appointment.doctorId,
      patient_id: appointment.patientId,
      status: appointment.status,
      
      created_at: appointment.createdAt?.toISOString(),
      updated_at: appointment.updatedAt?.toISOString(),
      deleted_at: appointment.deletedAt?.toISOString()
    };
  }

  public static fromNewDTO(dto: NewAppointmentDTO): NewAppointment {
    return {
      dateTime: dto.dateTime,
      doctorId: dto.doctorId,
      patientId: dto.patientId
    };
  }

  public static fromDTO(dto: AppointmentDTO): Appointment {
    return {
      id: dto.id,
      dateTime: dto.dateTime,
      doctorId: dto.doctorId,
      patientId: dto.patientId,
      status: dto.status,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt
    };
  }

  public static fromDBO(dbo: AppointmentDBO): Appointment {
    return {
      id: dbo.id,
      dateTime: dbo.date_time,
      doctorId: dbo.doctor_id,
      patientId: dbo.patient_id,
      status: dbo.status,
      
      createdAt: dbo.created_at ? new Date(dbo.created_at) : undefined,
      updatedAt: dbo.updated_at ? new Date(dbo.updated_at) : undefined,
      deletedAt: dbo.deleted_at ? new Date(dbo.deleted_at) : undefined
    };
  }
}