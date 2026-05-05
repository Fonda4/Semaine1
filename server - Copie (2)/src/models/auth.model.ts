import { Request } from 'express'; 
import { User, EROLES } from './user.model'; 

export interface AuthenticatedRequest extends Request {
  user?: User; 
}

export interface LoginResponseDTO {
  username: string;
  token: string;
  role: EROLES;
}