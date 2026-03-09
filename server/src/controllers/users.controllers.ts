import { Request, Response, Router } from 'express';
import { isNewUser } from '../utils/guards'; 
import { UsersMapper } from '../mappers/users.mapper';
import { NewUserDTO, NewUser, User, UserDTO } from '../models/user.model';

export const usersController = Router();

const usersDB: User[] = []; 

usersController.post('/', (req: Request, res: Response) => {
  
  const newUserDTO: NewUserDTO = req.body;

  if (!isNewUser(newUserDTO)) {
    res.status(400).send("Données utilisateur invalides");
    return; 
  }

  const newUser: NewUser = UsersMapper.toNewUser(newUserDTO);
  const createdUser: User = {
    username: newUser.username,
    password: newUser.password,
    role: newUser.role,
    email: newUser.email,
    lastName: newUser.lastName,
    firstName: newUser.firstName
  };
  
  usersDB.push(createdUser); 

  const responseDTO: UserDTO = UsersMapper.toUserDTO(createdUser);

  res.status(200).json(responseDTO);
});