"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsMapper = void 0;
class AppointmentsMapper {
    static toDTO(appointment) {
        return {
            id: appointment.id,
            dateTime: appointment.dateTime,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            status: appointment.status,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt
        };
    }
    static toDBO(appointment) {
        var _a, _b, _c;
        return {
            id: appointment.id,
            date_time: appointment.dateTime,
            doctor_id: appointment.doctorId,
            patient_id: appointment.patientId,
            status: appointment.status,
            created_at: (_a = appointment.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
            updated_at: (_b = appointment.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            deleted_at: (_c = appointment.deletedAt) === null || _c === void 0 ? void 0 : _c.toISOString()
        };
    }
    static fromNewDTO(dto) {
        return {
            dateTime: dto.dateTime,
            doctorId: dto.doctorId,
            patientId: dto.patientId
        };
    }
    static fromDTO(dto) {
        return {
            id: dto.id,
            dateTime: dto.dateTime,
            doctorId: dto.doctorId,
            patientId: dto.patientId,
            status: dto.status,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        };
    }
    static fromDBO(dbo) {
        return {
            id: dbo.id,
            dateTime: dbo.date_time,
            doctorId: dbo.doctor_id,
            patientId: dbo.patient_id,
            status: dbo.status,
            createdAt: dbo.created_at ? new Date(dbo.created_at) : undefined,
            updatedAt: dbo.updated_at ? new Date(dbo.updated_at) : undefined,
            deletedAt: dbo.deleted_at ? new Date(dbo.deleted_at) : undefined
        };
    }
}
exports.AppointmentsMapper = AppointmentsMapper;
