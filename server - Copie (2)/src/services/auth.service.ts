import { LoggerService } from "./logger.service";
import { AuthenticatedUser } from "../models/user.model";
import { UsersService } from "./user.services";
import * as bcrypt from 'bcrypt'; 
import { generateFakeToken, validateFakeToken } from "../utils/token.utils";
import { isString } from "../utils/guards";
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from "../models/auth.model";
export class AuthService{
    public static login  ( username:string, password:string): AuthenticatedUser |undefined {
        try{
            const user = UsersService.getByUserName(username);

            if(!user){
                LoggerService.error(`erreur : l'utilisateur ${username} n'extiste pas`);
                return undefined;
            }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
      
      if (!isPasswordValid) {
        LoggerService.error(`Connexion échouée : Mot de passe incorrect pour "${username}".`);
        return undefined;
      }

      const token = generateFakeToken(user.username);

      if (!token) {
        LoggerService.error(`Connexion échouée : Impossible de générer le token.`);
        return undefined;
      }
    const authenticatedUser: AuthenticatedUser ={
        username: user.username,
        token :token
    };
    return authenticatedUser;
    
    }catch{
        LoggerService.error('error')
    }
    
}
/**
     * Middleware d'autorisation pour protéger les routes.
     */
    public static authorize(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const token = req.get("authorization");

        if (!isString(token)) {
            res.status(401).send("Non autorisé : Token manquant ou invalide");
            return;
        }

        const username = validateFakeToken(token);

        if (!username) {
            res.status(401).send("Non autorisé : Token corrompu");
            return;
        }

        const existingUser = UsersService.getByUserName(username);

        if (!existingUser) {
            res.status(401).send("Non autorisé : Utilisateur introuvable");
            return;
        }

        req.user = existingUser;

        return next();
    }

    /**
     * Middleware de vérification des droits Administrateur.
     * ATTENTION : Doit toujours être placé APRÈS le middleware 'authorize' dans les routes !
     */
    public static isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        
        if (!req.user) {
            res.status(403).send("Interdit : Utilisateur introuvable dans la requête");
            return;
        }

        if (req.user.role !== 'admin') { 
            res.status(403).send("Interdit : Vous n'avez pas les droits d'administrateur");
            return;
        }

        return next();
    }






}