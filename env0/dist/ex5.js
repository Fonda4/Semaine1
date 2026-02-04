"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./modules/tools");
const AnOtherPerson = {
    firstName: "Jhon ",
    lastName: "Doe",
    id: 7
};
(0, tools_1.writePersonJSONFile)("person.json", AnOtherPerson);
