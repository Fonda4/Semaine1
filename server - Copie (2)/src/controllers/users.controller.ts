import { Request, Response, Router } from 'express';
import { isNewUser } from '../utils/guards'; 
import { UsersMapper } from '../mappers/users.mapper';
import { NewUserDTO, NewUser, UserDTO } from '../models/user.model';
import { LoggerService } from '../services/logger.service';
import { UsersService } from '../services/user.services';

export const usersController = Router();

LoggerService.debug("OK Users");

usersController.post('/', (req: Request, res: Response) => {
  
  const newUserDTO: NewUserDTO = req.body;

  if (!isNewUser(newUserDTO)) {
    res.status(400).send("Données utilisateur invalides");
    return; 
  }

  const newUser: NewUser = UsersMapper.toNewUser(newUserDTO);
  
  const createdUser = UsersService.create(newUser);

  if (!createdUser) {
    res.status(409).send("Création impossible : l'utilisateur existe déjà.");
    return;
  }

  const responseDTO: UserDTO = UsersMapper.toUserDTO(createdUser);
  
  LoggerService.info(`POST /users/ - Utilisateur créé : ${createdUser.username}`);
  res.status(201).json(responseDTO);
});