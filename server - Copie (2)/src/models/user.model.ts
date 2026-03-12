import { BasicModel, BasicModelDBO, BasicModelDTO } from "./basic.model";

export enum EROLES {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User extends BasicModel {
  username: string;
  password?: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface UserDBO extends BasicModelDBO {
  username: string;
  password?: string;
  role: EROLES;
  email: string;
  last_name: string;
  first_name: string;
}

export interface UserDTO extends BasicModelDTO {
  username: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface NewUser {
  username: string;
  password?: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface NewUserDTO {
  username: string;
  password?: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}