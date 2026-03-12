import { Address, AddressDBO } from "./address.model";
import { BasicModel, BasicModelDBO, BasicModelDTO } from "./basic.model";

export interface Patient extends BasicModel {
  firstName: string;
  lastName: string;
  birthDate: string;
  niss: string;
  address: Address;
  refDoctor: number;
}

export interface PatientDBO extends BasicModelDBO {
  first_name: string;
  last_name: string;
  birth_date: string;
  niss: string;
  address: AddressDBO;
  ref_doctor: number;
}

export interface PatientDTO extends BasicModelDTO {
  firstName: string;
  lastName: string;
  birthDate: string;
  niss: string;
  address: Address;
  refDoctor: number;
}

export interface NewPatient {
  firstName: string;
  lastName: string;
  birthDate: string;
  niss: string;
  address: Address;
  refDoctor: number;
}

export interface NewPatientDTO {
  firstName: string;
  lastName: string;
  birthDate: string;
  niss: string;
  address: Address;
  refDoctor: number;
}

export interface ShortPatientDTO {
  id: number;
  firstName: string;
  lastName: string;
}

export interface PatientFilter {
  zipCode?: string;
}
export interface ShortPatientDTO {
  id: number;
  firstName: string;
  lastName: string;
}