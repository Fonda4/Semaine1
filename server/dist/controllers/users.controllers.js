"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const express_1 = require("express");
const guards_1 = require("../utils/guards");
const users_mapper_1 = require("../mappers/users.mapper");
exports.usersController = (0, express_1.Router)();
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
    res.status(200).json(responseDTO);
});
