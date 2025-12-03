import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createTask: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const getTask: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const listTasks: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const executeTask: (req: AuthRequest, res: Response) => Promise<Response | void>;
//# sourceMappingURL=calculationTaskController.d.ts.map