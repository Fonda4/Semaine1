"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsMapper = void 0;
class DoctorsMapper {
    static toDTO(doctor) {
        return {
            id: doctor.id,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            speciality: doctor.speciality,
            createdAt: doctor.createdAt,
            updatedAt: doctor.updatedAt
        };
    }
    static toDBO(doctor) {
        var _a, _b, _c;
        return {
            id: doctor.id,
            first_name: doctor.firstName,
            last_name: doctor.lastName,
            speciality: doctor.speciality,
            created_at: (_a = doctor.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
            updated_at: (_b = doctor.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            deleted_at: (_c = doctor.deletedAt) === null || _c === void 0 ? void 0 : _c.toISOString()
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
            speciality: dbo.speciality,
            // La fameuse conversion string -> Date exigée par le prof :
            createdAt: dbo.created_at ? new Date(dbo.created_at) : undefined,
            updatedAt: dbo.updated_at ? new Date(dbo.updated_at) : undefined,
            deletedAt: dbo.deleted_at ? new Date(dbo.deleted_at) : undefined
        };
    }
}
exports.DoctorsMapper = DoctorsMapper;
