"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const users_mapper_1 = require("../mappers/users.mapper");
const logger_service_1 = require("../services/logger.service");
exports.usersController = (0, express_1.Router)();
logger_service_1.LoggerService.debug("OK Users");
const usersDB = [];
exports.usersController.post('/', (req, res) => {
    const newUserDTO = req.body;
    if (!(0, guards_1.isNewUser)(newUserDTO)) {
        res.status(400).send("Données utilisateur invalides");
        return;
    }
    const newUser = users_mapper_1.UsersMapper.toNewUser(newUserDTO);
    const createdUser = {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        email: newUser.email,
        lastName: newUser.lastName,
        firstName: newUser.firstName
    };
    usersDB.push(createdUser);
    const responseDTO = users_mapper_1.UsersMapper.toUserDTO(createdUser);
    logger_service_1.LoggerService.info(`GET /doctors/${req.params.id} `);
    res.status(200).json(responseDTO);
});
