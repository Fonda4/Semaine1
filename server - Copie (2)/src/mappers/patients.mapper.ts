import { Patient, PatientDTO, PatientShortDTO, NewPatient, NewPatientDTO, PatientDBO } from "../models/patient.model";
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

public static toDBO(patient: Patient): PatientDBO {
    return {
      id: patient.id,
      first_name: patient.firstName,
      last_name: patient.lastName,
      birthdate: patient.birthDate.toISOString(), 
      niss: patient.niss,
      ref_doctor: patient.refDoctor,
      address: {
        street: patient.address.street,
        number: patient.address.number,
        city: patient.address.city,
        country: patient.address.country,
        zip_code: patient.address.zipCode 
      }
    };
  }


  public static fromDBO(dbo: PatientDBO): Patient {
    return {
      id: dbo.id,
      firstName: dbo.first_name,
      lastName: dbo.last_name,
      birthDate: new Date(dbo.birthdate), 
      niss: dbo.niss,
      refDoctor: dbo.ref_doctor,
      address: {
        street: dbo.address.street,
        number: dbo.address.number,
        city: dbo.address.city,
        country: dbo.address.country,
        zipCode: dbo.address.zip_code 
      }
    };
  }




}

