import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const uploadFile: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const processFile: (req: AuthRequest, res: Response) => Promise<Response | void>;
//# sourceMappingURL=fileUploadController.d.ts.map