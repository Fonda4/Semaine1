"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const user_services_1 = require("../services/user.services");
const logger_service_1 = require("../services/logger.service");
exports.authController = (0, express_1.Router)();
logger_service_1.LoggerService.debug("OK Auth");
exports.authController.post('/login', (req, res) => {
    logger_service_1.LoggerService.info("[POST] /auth/login");
    const { username, password } = req.body;
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        res.status(400).send("Nom d'utilisateur et mot de passe invalides ou manquants");
        return;
    }
    const authenticatedUser = auth_service_1.AuthService.login(username, password);
    if (!authenticatedUser) {
        res.status(401).send("Identifiants incorrects");
        return;
    }
    const userDetails = user_services_1.UsersService.getByUserName(username);
    if (!userDetails) {
        res.status(401).send("Erreur lors de la récupération du profil");
        return;
    }
    const responseDTO = {
        username: authenticatedUser.username,
        token: authenticatedUser.token,
        role: userDetails.role
    };
    res.status(200).json(responseDTO);
});
