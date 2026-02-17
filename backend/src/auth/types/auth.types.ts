import type { Request } from 'express';
import type { User } from '../../users/user.entity';

export interface LoginResponse {
  accessToken: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
