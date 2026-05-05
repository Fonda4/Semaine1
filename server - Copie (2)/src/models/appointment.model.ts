import { BasicModel, BasicModelDBO, BasicModelDTO } from "./basic.model";

export enum EAppointmentStatus {
    NEW = 'NEW',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

// 1. Modèle Interne (Business Logic / Service)
export interface Appointment extends BasicModel {
    dateTime: string;
    doctorId: number;
    patientId: number;
    status: EAppointmentStatus;
}

// 2. DBO (Database Object - Fichier JSON)
export interface AppointmentDBO extends BasicModelDBO {
    date_time: string;
    doctor_id: number;
    patient_id: number;
    status: EAppointmentStatus;
}

// 3. DTO (Data Transfer Object - Requêtes/Réponses)
export interface AppointmentDTO extends BasicModelDTO {
    dateTime: string;
    doctorId: number;
    patientId: number;
    status: EAppointmentStatus;
}

// 4. Modèles de création (POST)
export type NewAppointment = Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type NewAppointmentDTO = Omit<AppointmentDTO, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'>;