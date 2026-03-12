import { NewUser, User, UserDBO } from '../models/user.model';
import { FilesService } from "./files.service";
import { LoggerService } from './logger.service';
import * as bcrypt from 'bcrypt'; 

export class UsersService {

  private static readonly FILE_PATH = 'data/users.json';

  public static getByUserName(username: string): User | undefined {
    try {
      const usersDBO = FilesService.readFile<UserDBO>(this.FILE_PATH);
      
      // SOFT DELETE : On ignore l'utilisateur s'il a été supprimé
      const userDBO = usersDBO.find(u => u.username === username && !u.deleted_at);

      if (userDBO) {
        return {
          id: userDBO.id, // Ajout de l'ID via BasicModel
          username: userDBO.username,
          password: userDBO.password,
          role: userDBO.role,
          email: userDBO.email,
          lastName: userDBO.last_name,
          firstName: userDBO.first_name,
          createdAt: userDBO.created_at ? new Date(userDBO.created_at) : undefined,
          updatedAt: userDBO.updated_at ? new Date(userDBO.updated_at) : undefined
        };
      }
      
      return undefined;
      
    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }

  public static create(newUser: NewUser): User | undefined {
    try {
      const existingUser = this.getByUserName(newUser.username);
      if (existingUser) {
        LoggerService.error(`Création échouée: L'utilisateur "${newUser.username}" existe déjà.`);
        return undefined;
      }

      const usersDBO = FilesService.readFile<UserDBO>(this.FILE_PATH);
      
      const maxId = usersDBO.reduce((max, currentDbo) => (currentDbo.id > max ? currentDbo.id : max), 0);
      const newId = maxId + 1;

      const hashedPassword = bcrypt.hashSync(newUser.password!, 10);
      
      const now = new Date();

      const userToSaveDBO: UserDBO = {
        id: newId,
        username: newUser.username,
        password: hashedPassword,
        role: newUser.role,
        email: newUser.email,
        last_name: newUser.lastName,
        first_name: newUser.firstName,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      };

      usersDBO.push(userToSaveDBO);
      FilesService.writeFile(this.FILE_PATH, usersDBO);

      const createdUser: User = {
        id: newId,
        username: newUser.username,
        password: hashedPassword,
        role: newUser.role,
        email: newUser.email,
        lastName: newUser.lastName,
        firstName: newUser.firstName,
        createdAt: now,
        updatedAt: now
      };

      return createdUser;

    } catch (error) {
      LoggerService.error(error);
      return undefined;
    }
  }
}