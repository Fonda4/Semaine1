"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersMapper = void 0;
class UsersMapper {
    static toNewUser(dto) {
        return {
            username: dto.username,
            password: dto.password,
            role: dto.role,
            email: dto.email,
            lastName: dto.lastName,
            firstName: dto.firstName
        };
    }
    static toUserDTO(user) {
        return {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName
        };
    }
}
exports.UsersMapper = UsersMapper;
