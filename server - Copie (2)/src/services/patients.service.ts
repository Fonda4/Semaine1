import { Patient, PatientDBO, PatientFilter } from "../models/patient.model";import { FilesService } from "../models/files.service";
import { LoggerService } from "./logger.service";
import { PatientsMapper } from "../mappers/patients.mapper";
import { DoctorsService } from "./doctors.service";

export class PatientsService {

  private static readonly FILE_PATH = 'data/patients.json';

  private static findPatientIndex(patients: PatientDBO[], id: number): number {
    return patients.findIndex(patient => patient.id === id);
  }


  public static getAll(filter?: PatientFilter): Patient[] {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      let patients = patientsDBO.map(dbo => PatientsMapper.fromDBO(dbo));

      if (filter && filter.zipCode) {
        patients = patients.filter(patient => patient.address.zipCode === filter.zipCode);
      }

      return patients;
    } catch (error) {
      LoggerService.error(error);
      return [];
    }
  }


  public static getById(id: number): Patient | undefined {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      const index = this.findPatientIndex(patientsDBO, id);
      
      if (index !== -1) {
        return PatientsMapper.fromDBO(patientsDBO[index]);
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static create(patient: Patient): Patient | undefined {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      
      const nissExists = patientsDBO.some(p => p.niss === patient.niss);
      if (nissExists) {
        LoggerService.error(`Création échouée: Le patient avec le NISS ${patient.niss} existe déjà.`);
        return undefined;
      }

      const doctorExists = DoctorsService.getById(patient.refDoctor);
      if (!doctorExists) {
        LoggerService.error(`Création échouée: Le médecin avec l'ID ${patient.refDoctor} n'existe pas.`);
        return undefined;
      }

      const maxId = patientsDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
      patient.id = maxId + 1;

      patientsDBO.push(PatientsMapper.toDBO(patient));
      FilesService.writeFile(this.FILE_PATH, patientsDBO);
      
      return patient;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static update(id: number, patient: Patient): Patient | undefined {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      const index = this.findPatientIndex(patientsDBO, id);

      if (index !== -1) {
        const doctorExists = DoctorsService.getById(patient.refDoctor);
        if (!doctorExists) {
          LoggerService.error(`Mise à jour échouée: Le médecin avec l'ID ${patient.refDoctor} n'existe pas.`);
          return undefined;
        }

        patient.id = id; 
        patientsDBO[index] = PatientsMapper.toDBO(patient);
        FilesService.writeFile(this.FILE_PATH, patientsDBO);
        return patient;
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static delete(id: number): boolean {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      const index = this.findPatientIndex(patientsDBO, id);

      if (index !== -1) {
        patientsDBO.splice(index, 1);
        FilesService.writeFile(this.FILE_PATH, patientsDBO);
        return true;
      }
      return false;
    } catch (error) {
      LoggerService.error(error);
      return false;
    }
  }


  public static getByNiss(niss: string): Patient | undefined {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      const patientDBO = patientsDBO.find(p => p.niss === niss);
      if (patientDBO) {
         return PatientsMapper.fromDBO(patientDBO);
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static getByZipCode(zipCode: string): Patient[] {
    try {
      const patientsDBO = FilesService.readFile<PatientDBO>(this.FILE_PATH);
      const filteredDBO = patientsDBO.filter(p => p.address.zip_code === zipCode);
      return filteredDBO.map(dbo => PatientsMapper.fromDBO(dbo));
    } catch (error) {
      LoggerService.error(error);
      return [];
    }
  }
}