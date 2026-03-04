"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsMapper = void 0;
class DoctorsMapper {
    static toDTO(doctor) {
        return {
            id: doctor.id,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            speciality: doctor.speciality
        };
    }
    static toDBO(doctor) {
        return {
            id: doctor.id,
            first_name: doctor.firstName,
            last_name: doctor.lastName,
            speciality: doctor.speciality
        };
    }
    static fromNewDTO(dto) {
        return {
            id: dto.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            speciality: dto.speciality
        };
    }
    static fromDTO(dto) {
        return {
            id: dto.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            speciality: dto.speciality
        };
    }
    static fromDBO(dbo) {
        return {
            id: dbo.id,
            firstName: dbo.first_name,
            lastName: dbo.last_name,
            speciality: dbo.speciality
        };
    }
}
exports.DoctorsMapper = DoctorsMapper;
