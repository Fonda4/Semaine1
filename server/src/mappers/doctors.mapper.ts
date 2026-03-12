import { Doctor, DoctorDTO, NewDoctor, NewDoctorDTO,DoctorDBO } from "../models/doctor.model";
export class DoctorsMapper {
  
  public static toDTO(doctor: Doctor): DoctorDTO {
    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      speciality: doctor.speciality,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt
    };
  }

  public static toDBO(doctor: Doctor): DoctorDBO {
    return {
      id: doctor.id,
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      speciality: doctor.speciality,
      
      created_at: doctor.createdAt?.toISOString(),
      updated_at: doctor.updatedAt?.toISOString(),
      deleted_at: doctor.deletedAt?.toISOString()
    };
  }

  public static fromNewDTO(dto: NewDoctorDTO): NewDoctor {
    return {
      id:dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      speciality: dto.speciality
    };

}

public static fromDTO(dto: NewDoctorDTO): NewDoctor {
    return {
      id:dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      speciality: dto.speciality
    };
}

public static fromDBO(dbo: DoctorDBO): Doctor {
    return {
      id: dbo.id,
      firstName: dbo.first_name,
      lastName: dbo.last_name,
      speciality: dbo.speciality,
      
      // La fameuse conversion string -> Date exigée par le prof :
      createdAt: dbo.created_at ? new Date(dbo.created_at) : undefined,
      updatedAt: dbo.updated_at ? new Date(dbo.updated_at) : undefined,
      deletedAt: dbo.deleted_at ? new Date(dbo.deleted_at) : undefined
    };
  }


}
