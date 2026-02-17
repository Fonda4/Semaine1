import { Person } from "./person.model";

export interface Doctor extends Person {
  speciality: string;
}

export interface DoctorDTO {
  id: number;
  firstName: string;
  lastName: string;
  speciality: string;
}

export interface NewDoctorDTO {
  firstName: string;
  lastName: string;
  speciality: string;
}

export interface NewDoctor {
  firstName: string;
  lastName: string;
  speciality: string;
}
