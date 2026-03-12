import { NewUserDTO, NewUser, User, UserDTO } from '../models/user.model';

export class UsersMapper {
  
  public static toNewUser(dto: NewUserDTO): NewUser {
    return {
      username: dto.username,
      password: dto.password,
      role: dto.role, 
      email: dto.email,
      lastName: dto.lastName,
      firstName: dto.firstName
    };
  }

  public static toUserDTO(user: User): UserDTO {
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