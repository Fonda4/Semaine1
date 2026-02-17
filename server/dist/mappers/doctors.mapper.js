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
    static fromNewDTO(dto) {
        return {
            firstName: dto.firstName,
            lastName: dto.lastName,
            speciality: dto.speciality
        };
    }
}
exports.DoctorsMapper = DoctorsMapper;
