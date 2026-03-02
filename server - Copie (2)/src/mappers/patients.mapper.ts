import { Patient, PatientDTO, PatientShortDTO, NewPatient, NewPatientDTO } from "../models/patient.model";

export class PatientsMapper {
  
  public static toDTO(patient: Patient): PatientDTO {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      niss: patient.niss,
      address: patient.address,
      refDoctor: patient.refDoctor
    };
  }

  public static toShortDTO(patient: Patient): PatientShortDTO {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName
    };
  }

  public static fromNewDTO(dto: NewPatientDTO): NewPatient {
    return {
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: new Date(dto.birthDate),
      niss: dto.niss,
      address: dto.address,
      refDoctor: dto.refDoctor
    };
  }

  public static fromDTO(dto: PatientDTO): Patient {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: new Date(dto.birthDate),
      niss: dto.niss,
      address: dto.address,
      refDoctor: dto.refDoctor
    };
  }
}
