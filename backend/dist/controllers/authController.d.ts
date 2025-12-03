import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const login: (req: Request, res: Response) => Promise<Response | void>;
export declare const getCurrentUser: (req: AuthRequest, res: Response) => Promise<Response | void>;
//# sourceMappingURL=authController.d.ts.map