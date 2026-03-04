import { Doctor, DoctorDTO, NewDoctor, NewDoctorDTO,DoctorDBO } from "../models/doctor.model";
export class DoctorsMapper {
  
  public static toDTO(doctor: Doctor): DoctorDTO {
    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      speciality: doctor.speciality
    };
  }

  public static toDBO(doctor:Doctor):DoctorDBO{
    return {
      id: doctor.id,
      first_name: doctor.firstName,
      last_name: doctor.lastName,
      speciality: doctor.speciality
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

public static fromDBO (dbo: DoctorDBO): Doctor{
return{
      id: dbo.id,
      firstName: dbo.first_name,
      lastName: dbo.last_name,
      speciality: dbo.speciality
    };
}


}
