import { Doctor, DoctorDTO, NewDoctor, NewDoctorDTO } from "../models/doctor.model";
export class DoctorsMapper {
  
  public static toDTO(doctor: Doctor): DoctorDTO {
    return {
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
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
}
