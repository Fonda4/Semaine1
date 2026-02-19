import { Address } from "./address.model";
import { Person } from "./person.model";

export interface Patient extends Person {
  birthDate: Date;
  niss: string;
  address: Address;
  refDoctor: number;
}

export interface PatientDTO {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  niss: string;
  address: Address;
  refDoctor: number;
}

export interface PatientShortDTO {
  id: number;
  firstName: string;
  lastName: string;
}

export interface NewPatientDTO {
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
  birthDate: Date;
  niss: string;
  address: Address;
  refDoctor: number;
}
