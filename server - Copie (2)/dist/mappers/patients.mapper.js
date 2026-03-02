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
            birthDate: new Date(dto.birthDate),
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
            birthDate: new Date(dto.birthDate),
            niss: dto.niss,
            address: dto.address,
            refDoctor: dto.refDoctor
        };
    }
}
exports.PatientsMapper = PatientsMapper;
