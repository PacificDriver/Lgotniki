import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getCurrentProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCurrentProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listOperators: (_req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createOperator: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateOperator: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteOperator: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=userController.d.ts.map