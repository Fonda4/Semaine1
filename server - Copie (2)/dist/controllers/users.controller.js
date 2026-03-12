"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const users_mapper_1 = require("../mappers/users.mapper");
const logger_service_1 = require("../services/logger.service");
const user_services_1 = require("../services/user.services");
exports.usersController = (0, express_1.Router)();
logger_service_1.LoggerService.debug("OK Users");
exports.usersController.post('/', (req, res) => {
    const newUserDTO = req.body;
    if (!(0, guards_1.isNewUser)(newUserDTO)) {
        res.status(400).send("Données utilisateur invalides");
        return;
    }
    const newUser = users_mapper_1.UsersMapper.toNewUser(newUserDTO);
    const createdUser = user_services_1.UsersService.create(newUser);
    if (!createdUser) {
        res.status(409).send("Création impossible : l'utilisateur existe déjà.");
        return;
    }
    const responseDTO = users_mapper_1.UsersMapper.toUserDTO(createdUser);
    logger_service_1.LoggerService.info(`POST /users/ - Utilisateur créé : ${createdUser.username}`);
    res.status(201).json(responseDTO);
});
