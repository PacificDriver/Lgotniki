import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const createBeneficiary: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const getBeneficiary: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const listBeneficiaries: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const updateBeneficiary: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const deleteBeneficiary: (req: AuthRequest, res: Response) => Promise<Response | void>;
export declare const getBeneficiaryOperations: (req: AuthRequest, res: Response) => Promise<Response | void>;
//# sourceMappingURL=beneficiaryController.d.ts.map