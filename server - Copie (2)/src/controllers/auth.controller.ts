import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/user.services';
import { LoginResponseDTO } from '../models/auth.model';
import { LoggerService } from '../services/logger.service';

export const authController = Router();
LoggerService.debug("OK Auth");


authController.post('/login', (req: Request, res: Response) => {
  LoggerService.info("[POST] /auth/login");
  
  const { username, password } = req.body;

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).send("Nom d'utilisateur et mot de passe invalides ou manquants");
    return;
  }

  const authenticatedUser = AuthService.login(username, password);

  if (!authenticatedUser) {
    res.status(401).send("Identifiants incorrects");
    return;
  }

  const userDetails = UsersService.getByUserName(username);

  if (!userDetails) {
    res.status(401).send("Erreur lors de la récupération du profil");
    return;
  }

  const responseDTO: LoginResponseDTO = {
    username: authenticatedUser.username,
    token: authenticatedUser.token,
    role: userDetails.role
  };

  res.status(200).json(responseDTO);
});

