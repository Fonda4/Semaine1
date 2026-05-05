"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsMapper = void 0;
class PatientsMapper {
    static toDTO(patient) {
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
    static toShortDTO(patient) {
        return {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName
        };
    }
    static fromNewDTO(dto) {
        return {
            firstName: dto.firstName,
            lastName: dto.lastName,
            birthDate: dto.birthDate,
            niss: dto.niss,
            address: dto.address,
            refDoctor: dto.refDoctor
        };
    }
    static fromDTO(dto) {
        return {
            id: dto.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            birthDate: dto.birthDate,
            niss: dto.niss,
            address: dto.address,
            refDoctor: dto.refDoctor
        };
    }
    static toDBO(patient) {
        return {
            id: patient.id,
            first_name: patient.firstName,
            last_name: patient.lastName,
            birth_date: patient.birthDate,
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
    static fromDBO(dbo) {
        return {
            id: dbo.id,
            firstName: dbo.first_name,
            lastName: dbo.last_name,
            birthDate: dbo.birth_date,
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
exports.PatientsMapper = PatientsMapper;
