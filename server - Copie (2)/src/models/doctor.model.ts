import { BasicModel, BasicModelDBO, BasicModelDTO } from "./basic.model";

export interface Doctor extends BasicModel {
  firstName: string;
  lastName: string;
  speciality: string;
}

export interface DoctorDTO extends BasicModelDTO {
  firstName: string;
  lastName: string;
  speciality: string;
}

export interface NewDoctorDTO {
  id:number;
  firstName: string;
  lastName: string;
  speciality: string;
}

export interface NewDoctor {
  id : number;
  firstName: string;
  lastName: string;
  speciality: string;
}

export interface DoctorFilter {
  speciality?: string;
}

export interface DoctorDBO extends BasicModelDBO {
  first_name: string;
  last_name: string;
  speciality: string;
}