export enum EROLES {
  USER = "user",
  ADMIN = "admin"
}

export interface UserDBO {
  username: string;
  password: string;
  role: EROLES;
  email: string;
  last_name: string;
  first_name: string;
}

export interface User {
  username: string;
  password: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface UserDTO {
  username: string;
  password?: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface NewUser {
  username: string;
  password: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface NewUserDTO {
  username: string;
  password: string;
  role: EROLES;
  email: string;
  lastName: string;
  firstName: string;
}

export interface AuthenticatedUser {
  username: string;
  token: string;
}