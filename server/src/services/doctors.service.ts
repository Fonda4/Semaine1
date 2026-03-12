import { Doctor, DoctorFilter, DoctorDBO } from "../models/doctor.model";
import { FilesService } from "./files.service";
import { LoggerService } from "./logger.service";
import { DoctorsMapper } from "../mappers/doctors.mapper";

export class DoctorsService {

  private static findDoctorIndex(doctors: DoctorDBO[], id: number): number {
    for (let i = 0; i < doctors.length; i++) {
      if (doctors[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  public static getAll(filter?: DoctorFilter): Doctor[] {
    try {
      const doctorsDBO: DoctorDBO[] = FilesService.readFile<DoctorDBO>('data/doctors.json');
      let doctors: Doctor[] = doctorsDBO.map(dbo => DoctorsMapper.fromDBO(dbo));

      // SOFT DELETE : On retire tous les médecins qui ont une date de suppression
      doctors = doctors.filter(doctor => !doctor.deletedAt);

      if (filter && filter.speciality) {
        doctors = doctors.filter(doctor => doctor.speciality === filter.speciality);
      }

      return doctors;
    } catch (error) {
      LoggerService.error(error);
      return [];
    }
  }

  public static getById(id: number): Doctor | undefined {
    try {
      const doctorsDBO: DoctorDBO[] = FilesService.readFile<DoctorDBO>('data/doctors.json');
      const index = this.findDoctorIndex(doctorsDBO, id);
      
      // SOFT DELETE : On vérifie que le médecin existe ET qu'il n'est pas supprimé
      if (index !== -1 && !doctorsDBO[index].deleted_at) {
        return DoctorsMapper.fromDBO(doctorsDBO[index]);
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static create(doctor: Doctor): Doctor | undefined {
    try {
      const doctorsDBO: DoctorDBO[] = FilesService.readFile<DoctorDBO>('data/doctors.json');
      
      const maxId = doctorsDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
      
      doctor.id = maxId + 1;

      // TRACKING : Ajout des dates de création et de mise à jour au moment de la création
      doctor.createdAt = new Date();
      doctor.updatedAt = new Date();

      doctorsDBO.push(DoctorsMapper.toDBO(doctor));
      
      FilesService.writeFile('data/doctors.json', doctorsDBO);
      
      return doctor;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static update(id: number, doctor: Doctor): Doctor | undefined {
    try {
      const doctorsDBO: DoctorDBO[] = FilesService.readFile<DoctorDBO>('data/doctors.json');
      const index = this.findDoctorIndex(doctorsDBO, id);

      // SOFT DELETE : On ne peut mettre à jour qu'un médecin qui n'est pas supprimé
      if (index !== -1 && !doctorsDBO[index].deleted_at) {
        doctor.id = id;

        // TRACKING : On conserve l'ancienne date de création (si elle existait), et on actualise la date de mise à jour
        doctor.createdAt = doctorsDBO[index].created_at ? new Date(doctorsDBO[index].created_at as string) : new Date();
        doctor.updatedAt = new Date();

        doctorsDBO[index] = DoctorsMapper.toDBO(doctor);
        FilesService.writeFile('data/doctors.json', doctorsDBO);
        return doctor;
      }
      return undefined;
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static delete(id: number): boolean {
    try {
      const doctorsDBO: DoctorDBO[] = FilesService.readFile<DoctorDBO>('data/doctors.json');
      const index = this.findDoctorIndex(doctorsDBO, id);

      if (index !== -1 && !doctorsDBO[index].deleted_at) {
        
        doctorsDBO[index].deleted_at = new Date().toISOString();
        
        FilesService.writeFile('data/doctors.json', doctorsDBO);
        return true;
      }
      return false;
    } catch (error) {
      LoggerService.error(error);
      return false;
    }
  }
}